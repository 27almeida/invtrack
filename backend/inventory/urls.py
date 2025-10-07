from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomObtainAuthToken, login_view

from .views import ProdutoViewSet, MovimentoViewSet, RegisterView

router = DefaultRouter()
router.register(r"produtos", ProdutoViewSet, basename="produto")
router.register(r"movimentos", MovimentoViewSet, basename="movimento")

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', login_view, name='login'),
]
