

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0002_produto_codigo_barras_produto_preco'),
    ]

    operations = [
        migrations.AddField(
            model_name='produto',
            name='pedido_reposicao',
            field=models.BooleanField(default=False),
        ),
    ]
