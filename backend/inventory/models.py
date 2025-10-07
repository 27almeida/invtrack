from django.db import models
# base de dados
class Produto(models.Model):
    nome = models.CharField(max_length=100)
    codigo_barras = models.CharField(max_length=50)
    quantidade = models.IntegerField()
    quantidade_minima = models.IntegerField()
    codigo_barras = models.CharField(max_length=50, null=True, blank=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    pedido_reposicao = models.BooleanField(default=False)

    def em_rutura(self):
        return self.quantidade < self.quantidade_minima

    def __str__(self):
        return self.nome

class Movimento(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=10, choices=[('entrada','Entrada'), ('saida','Saída')])
    quantidade = models.IntegerField()
    criado_em = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.tipo} {self.quantidade}x {self.produto.nome} em {self.criado_em}"


