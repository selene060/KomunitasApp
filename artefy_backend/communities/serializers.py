from rest_framework import serializers
from .models import Community, CommunityMember
from django.db import connection 
from django.conf import settings
class CommunitySerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    member_status = serializers.SerializerMethodField() 
    class Meta:
        model = Community
        fields = '__all__'

    def get_is_member(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
            
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT EXISTS(
                    SELECT 1 
                    FROM community_members 
                    WHERE community_id = %s 
                    AND user_id = %s 
                    AND status = 'active'
                ) as is_member
            """, [obj.id, request.user.id])
            return cursor.fetchone()[0]

    def get_member_status(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
            
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT status FROM community_members 
                WHERE community_id = %s 
                AND user_id = %s
            """, [obj.id, request.user.id])
            result = cursor.fetchone()
            return result[0] if result else None
    # def get_photo_community(self, obj):
    #     if obj.photo_community:
    #         return f"{settings.BASE_URL}{settings.MEDIA_URL}{obj.photo_community}"
    #     return None
        # serializers
    def get_category_name(self, obj):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT name FROM categories_category 
                WHERE id = %s
            """, [obj.category_id])
            result = cursor.fetchone()
            return result[0] if result else None
            
    def get_member_count(self, obj):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT COUNT(*) FROM community_members 
                WHERE community_id = %s AND status = 'active'
            """, [obj.id])
            return cursor.fetchone()[0]
        
    # def get_is_member(self, obj):
    #     with connection.cursor() as cursor:
    #         cursor.execute("""
    #             SELECT COUNT(*) FROM community_members 
    #             WHERE community_id = %s AND user_id = %s AND status = 'active'
    #         """, [obj.id, self.context['request'].user.id])
    #         return cursor.fetchone()[0] > 0
    # def get_is_member(self, obj):
    #     request = self.context.get('request')
    #     if request and request.user.is_authenticated:
    #         return CommunityMember.objects.filter(
    #             community_id=obj.id,
    #             user_id=request.user.id,
    #             status='active'
    #         ).exists()
    #     return False
        
    def get_user_role(self, obj):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT role FROM community_members 
                WHERE community_id = %s AND user_id = %s AND status = 'active'
            """, [obj.id, self.context['request'].user.id])
            result = cursor.fetchone()
            return result[0] if result else None