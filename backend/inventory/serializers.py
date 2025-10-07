from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Produto, Movimento
# base de dados
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ("username", "password")

    def create(self, validated_data):
        user = User(username=validated_data["username"])
        user.set_password(validated_data["password"])
        user.save()
        return user

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = "__all__"

class MovimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimento
        fields = "__all__"
    def create(self, validated_data):
        produto = validated_data["produto"]
        tipo = validated_data["tipo"]
        quantidade = validated_data["quantidade"]
        if tipo == "entrada":
            produto.quantidade += quantidade
        elif tipo == "saida":
            produto.quantidade -= quantidade

        produto.save()

        return super().create(validated_data)



