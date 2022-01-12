from maestro_api.libs.datetime import now
from mongoengine import Document, DateTimeField


class CreatedUpdatedDocumentMixin(Document):
    meta = {
        "abstract": True,
    }
    created_at = DateTimeField(default=now)
    updated_at = DateTimeField(default=now)

    def save(self, *args, **kwargs):
        if not self.created_at:
            self.created_at = now()
        self.updated_at = now()
        return super(CreatedUpdatedDocumentMixin, self).save(*args, **kwargs)
