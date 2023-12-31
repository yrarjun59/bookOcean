from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

from django.contrib.auth.models import User
from .models import Profile


def createProfile(sender, instance, created, **kwargs):
    print("Profile Triggered")
    if created:
        user = instance
        profile = Profile.objects.create(
            user=user,
            username=user.username,
            email=user.email,
            name=user.first_name,
        )


def updateUser(sender, instance, created, **kwargs):
    profile = instance
    user = profile.user

    if created == False:
        profile.name = user.first_name + user.last_name
        user.username = profile.username
        user.email = profile.email
        user.save()


def updateUserForEmail(sender, instance, **kwargs):
    user = instance
    if user.email != "":
        user.username = user.email


pre_save.connect(updateUserForEmail, sender=User)


def deleteUser(sender, instance, **kwargs):
    try:
        user = instance.user
        user.delete()
    except:
        pass


post_save.connect(createProfile, sender=User)
post_save.connect(updateUser, sender=Profile)
post_delete.connect(deleteUser, sender=Profile)
