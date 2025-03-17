from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import connection, transaction
from .models import Community, CommunityMember, CommunityJoinRequest
from .serializers import CommunitySerializer
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from users.models import User
from django.db.models import F
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import JsonResponse

def get_user_communities(request, user_id):
    # Using raw SQL for optimal performance
    query = """
        SELECT c.id, c.name, c.category_id, c.photo_community
        FROM Communities c
        INNER JOIN Community_Members cm ON c.id = cm.community_id
        WHERE cm.user_id = %s AND cm.status = 'active'
        ORDER BY c.name
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, [user_id])
        columns = [col[0] for col in cursor.description]
        communities = [dict(zip(columns, row)) for row in cursor.fetchall()]
    
    return JsonResponse(communities, safe=False)
def get_community_members(request, community_id):
    """
    Get all active members of a specific community
    """
    try:
        # Get community members
        members = CommunityMember.objects.filter(
            community_id=community_id,
            status='active'
        )
        
        member_list = []
        for member in members:
            # Get user data for each member
            try:
                user = User.objects.get(id=member.user_id)
                member_list.append({
                    'id': member.id,
                    'user_id': member.user_id,
                    'name': user.username,  # or user.get_full_name() if you want full name
                    'email': user.email,
                    'profile_picture': str(user.profile_picture) if user.profile_picture else None,
                    'status': member.status,
                    'role': member.role,
                    'joined_at': member.joined_at.isoformat()
                })
            except User.DoesNotExist:
                continue
        
        return JsonResponse(member_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_join_community(request, community_id):
    try:
        community = Community.objects.get(pk=community_id)
        user_id = request.user.id
        
        # Check if user is already an active member
        member = CommunityMember.objects.filter(
            community_id=community_id,
            user_id=user_id
        ).first()
        
        if member and member.status == 'active':
            return Response(
                {'message': 'You are already a member of this community'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get existing join request
        existing_request = CommunityJoinRequest.objects.filter(
            community_id=community_id,
            user_id=user_id
        ).first()
        
        if existing_request:
            # If there's a pending request, don't allow new one
            if existing_request.status == 'pending':
                return Response(
                    {'message': 'You already have a pending request for this community'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update existing request instead of creating new one
            existing_request.status = 'pending'
            existing_request.request_message = request.data.get('message', '')
            existing_request.requested_at = timezone.now()
            existing_request.processed_at = None
            existing_request.processed_by = None
            existing_request.save()
            
            return Response(
                {'message': 'Join request submitted successfully'},
                status=status.HTTP_201_CREATED
            )
            
        # Create new join request if none exists
        with transaction.atomic():
            # First handle community member if exists
            if member:
                # Update existing member status to inactive
                member.status = 'inactive'
                member.save()
            
            # Then create the join request
            join_request = CommunityJoinRequest.objects.create(
                community_id=community_id,
                user_id=user_id,
                request_message=request.data.get('message', ''),
                status='pending'
            )
        
        return Response(
            {'message': 'Join request submitted successfully'},
            status=status.HTTP_201_CREATED
        )
        
    except Community.DoesNotExist:
        return Response(
            {'message': 'Community not found'},
            status=status.HTTP_404_NOT_FOUND
        )
            
# views.py
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_join_requests(request):
    try:
        print("Current user ID:", request.user.id)  # Debug print
        
        with connection.cursor() as cursor:
            query = """
                SELECT 
                    cjr.id,
                    cjr.community_id,
                    cjr.user_id,
                    cjr.request_message,
                    cjr.requested_at,
                    u.username as user_name
                FROM 
                    Community_Join_Requests cjr
                INNER JOIN 
                    Community_Members cm ON cm.community_id = cjr.community_id
                INNER JOIN 
                    Users_user u ON u.id = cjr.user_id
                WHERE 
                    cm.user_id = %s
                    AND cm.role = 'admin'
                    AND cm.status = 'active'
                    AND cjr.status = 'pending'
                ORDER BY 
                    cjr.requested_at DESC
            """
            
            print("Executing query with user_id:", request.user.id)  # Debug print
            cursor.execute(query, [request.user.id])
            
            columns = [col[0] for col in cursor.description]
            pending_requests = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
            ]
            
            # Format dates to ISO format for JSON serialization
            for request_data in pending_requests:
                if 'requested_at' in request_data and request_data['requested_at']:
                    request_data['requested_at'] = request_data['requested_at'].isoformat()
            
            print("Found pending requests:", pending_requests)  # Debug print

        return Response({
            'message': 'Success',
            'data': pending_requests
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in get_pending_join_requests: {str(e)}")
        return Response({
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_join_request(request, request_id):
    try:
        # First check if user is admin of the community
        with connection.cursor() as cursor:
            # Get the community_id for the join request
            cursor.execute("""
                SELECT community_id, user_id 
                FROM Community_Join_Requests 
                WHERE id = %s
            """, [request_id])
            join_request = cursor.fetchone()
            
            if not join_request:
                return Response(
                    {'message': 'Join request not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            community_id, requesting_user_id = join_request
            
            # Check if current user is admin
            cursor.execute("""
                SELECT 1 
                FROM Community_Members 
                WHERE community_id = %s 
                AND user_id = %s 
                AND role = 'admin'
                AND status = 'active'
            """, [community_id, request.user.id])
            
            is_admin = cursor.fetchone() is not None
            
            if not is_admin:
                return Response(
                    {'message': 'Only community admins can process join requests'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            action = request.data.get('action')
            if action not in ['approve', 'reject']:
                return Response(
                    {'message': 'Invalid action'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update join request status
            cursor.execute("""
                UPDATE Community_Join_Requests 
                SET status = %s,
                    processed_at = NOW(),
                    processed_by = %s
                WHERE id = %s
            """, [action, request.user.id, request_id])
            
            # If approved, update or insert community member
            if action == 'approve':
                # First check if member already exists
                cursor.execute("""
                    SELECT 1 
                    FROM Community_Members 
                    WHERE community_id = %s 
                    AND user_id = %s
                """, [community_id, requesting_user_id])
                
                member_exists = cursor.fetchone() is not None
                
                if member_exists:
                    # Update existing member
                    cursor.execute("""
                        UPDATE Community_Members 
                        SET status = 'active',
                            joined_at = NOW()
                        WHERE community_id = %s 
                        AND user_id = %s
                    """, [community_id, requesting_user_id])
                else:
                    # Insert new member
                    cursor.execute("""
                        INSERT INTO Community_Members 
                        (community_id, user_id, role, status, joined_at)
                        VALUES (%s, %s, 'member', 'active', NOW())
                    """, [community_id, requesting_user_id])
            
            return Response({
                'message': f'Join request {action}d successfully'
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        print(f"Error in process_join_request: {str(e)}")  
        return Response({
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CommunityViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]  
    permission_classes = [IsAuthenticated]
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    parser_classes = (MultiPartParser, FormParser) 
    def list(self, request, *args, **kwargs):
        # Debug prints
        print("Request user:", request.user)
        print("Is authenticated:", request.user.is_authenticated)
        print("User ID:", request.user.id if request.user.is_authenticated else None)
        
        response = super().list(request, *args, **kwargs)
        return response
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    def perform_create(self, serializer):
        community = serializer.save()
        
        with connection.cursor() as cursor:
            cursor.execute("""
            INSERT INTO community_members 
            (community_id, user_id, role, status, joined_at) 
            VALUES (%s, %s, %s, %s, %s)
        """, [
            community.id, 
            self.request.user.id, 
            'admin', 
            'active',
            timezone.now()  # Add current timestamp
        ])
    def get_queryset(self):
        queryset = Community.objects.all()
        status = self.request.query_params.get('status', None)
        type = self.request.query_params.get('type', None)
        
        if status:
            queryset = queryset.filter(status=status)
        if type:
            queryset = queryset.filter(communities_type=type)
            
        return queryset
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def join(self, request, pk=None):
        community = self.get_object()
        user_id = request.user.id

        # Check if user is already a member
        existing_member = CommunityMember.objects.filter(
            community_id=community.id,
            user_id=user_id
        ).first()

        if existing_member:
            if existing_member.status == 'active':
                return Response(
                    {'error': 'Already a member'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Reactivate if previously inactive
            existing_member.status = 'active'
            existing_member.save()
            return Response({'status': 'membership reactivated'})

        # Check if premium community
        if community.communities_type == 'premium':
            # Add your premium validation logic here
            pass

        # Create new membership
        CommunityMember.objects.create(
            community_id=community.id,
            user_id=user_id,
            role='member',
            status='active'
        )

        return Response({'status': 'joined'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def leave(self, request, pk=None):
        community = self.get_object()
        user_id = request.user.id

        try:
            member = CommunityMember.objects.get(
                community_id=community.id,
                user_id=user_id,
                status='active'
            )

            # Check if last admin
            if member.role == 'admin':
                admin_count = CommunityMember.objects.filter(
                    community_id=community.id,
                    role='admin',
                    status='active'
                ).count()
                
                if admin_count == 1:
                    return Response(
                        {'error': 'Cannot leave as last admin'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            member.status = 'inactive'
            member.save()
            return Response({'status': 'left'})

        except CommunityMember.DoesNotExist:
            return Response(
                {'error': 'Not a member'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    cm.id, 
                    cm.role, 
                    cm.status, 
                    u.username, 
                    u.email
                FROM community_members cm
                JOIN users_user u ON cm.user_id = u.id
                WHERE cm.community_id = %s
            """, [pk])
            
            members = [
                {
                    'id': row[0],
                    'role': row[1],
                    'status': row[2],
                    'username': row[3],
                    'email': row[4]
                } for row in cursor.fetchall()
            ]

        return Response(members)