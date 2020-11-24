import random
import string

from django.utils.text import slugify


def get_random_string():
    s = "".join(
        [random.choice(string.ascii_lowercase + string.digits) for i in range(10)]
    )
    return s.lower()


def generate_unique_slug(instance, new_slug=None):
    if new_slug is not None:
        slug = new_slug
    else:
        slug = slugify(instance.title)

    Klass = instance.__class__
    if Klass.objects.filter(slug=slug).exclude(pk=instance.pk).exists():
        new_slug = "%s-%s" % (slug, get_random_string())
        return generate_unique_slug(instance, new_slug=new_slug)
    return slug
