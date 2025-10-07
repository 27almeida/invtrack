from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from inventory.views import (
    ProdutoViewSet,
    MovimentoViewSet,
    register_user,
    login_user,
)

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet, basename='produto')
router.register(r'movimentos', MovimentoViewSet, basename='movimento')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', register_user),
    path('api/login/', login_user),
]
