from django.urls import path

from job_credits.views import InvoicesListAPI, InvoiceDetailAPI, \
    creditslist, BuyCredits, JobCreditHistoryByDealer, JobCreditHistoryByUser, DealerBalanceAPI, \
    BuyCreditsWithPromoCodeAPI, Promolist, BuyCreditsNewAPI, JobCreditHistoryByDealerNew

urlpatterns = [
    # path('', include(router.urls)),

    path('credits/', creditslist.as_view()),
    path('promocodes/', Promolist.as_view()),
    path('invoices/', InvoicesListAPI.as_view()),
    path('buy-credits/', BuyCredits.as_view()),
    path('buy-credits-with-promocode/', BuyCreditsWithPromoCodeAPI.as_view()),
    path('dealer-credit-history/', JobCreditHistoryByDealer.as_view()),
    path('new-dealer-credit-history/', JobCreditHistoryByDealerNew.as_view(),name ="new_dealer_credit_history"),
    path('user-credit-history/', JobCreditHistoryByUser.as_view()),
    path('invoices/<slug:invoice_id>/', InvoiceDetailAPI.as_view(),name="invoice-info"),
    path('balance/<slug:dealer_id>/', DealerBalanceAPI.as_view()),
    path('buy-credits-new/', BuyCreditsNewAPI.as_view(),name ="buy-credits-new"),

]

