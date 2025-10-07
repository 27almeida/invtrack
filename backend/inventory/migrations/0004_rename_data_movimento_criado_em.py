

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0003_produto_pedido_reposicao'),
    ]

    operations = [
        migrations.RenameField(
            model_name='movimento',
            old_name='data',
            new_name='criado_em',
        ),
    ]
