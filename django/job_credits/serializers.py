from rest_framework import serializers

from jobs.models import  JobCreditHistory


class JobCreditHistorySerializer(serializers.ModelSerializer):
    transaction_date=serializers.DateTimeField(source='created_on')
    invoice_id =serializers.ReadOnlyField(source='invoice.slug',allow_null=True)
    payment_gateway =serializers.ReadOnlyField(source='invoice.payment_gateway',allow_null=True)
    dealer_id =serializers.ReadOnlyField(source='dealer.slug',allow_null=True)
    dealer_name =serializers.ReadOnlyField(source='dealer.dealer_name',allow_null=True)
    user_id =serializers.ReadOnlyField(source='user.id',allow_null=True)
    job_id =serializers.ReadOnlyField(source='job.slug',allow_null=True)
    class Meta:
        model = JobCreditHistory
        fields = (
            'slug',
            'transaction_date',
            'invoice_id',
            'payment_gateway',
            'dealer_id',
            'dealer_name',
            'user_id',
            'job_id',
            'quantity',
            'description',
            'remarks',
        )

