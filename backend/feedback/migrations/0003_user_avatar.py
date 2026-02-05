from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('feedback', '0002_complainthistory'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='avatars/'),
        ),
    ]
