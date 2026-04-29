// src/pages/client/PaymentsPage.jsx
// Full Razorpay payment integration + invoice list
import { useApi } from "../../hooks/useApi";
import { Card, CardHeader, StatCard, StatusBadge, PageHeader, Spinner, EmptyState } from "../../components/common/UI";
import { CreditCard, CheckCircle, AlertCircle, Calendar, Download, ShieldCheck } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PaymentsPage = () => {
  const { data, loading, refetch } = useApi("/payments");
  const payments = data?.payments || [];

  const totalPaid    = payments.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount + p.tax, 0);
  const totalPending = payments.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount + p.tax, 0);

  const handlePay = async (invoiceId) => {
    const ok = await loadRazorpay();
    if (!ok) { toast.error("Razorpay SDK failed to load."); return; }
    try {
      const { data: orderData } = await api.post(`/payments/${invoiceId}/create-order`);
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: orderData.name,
        description: orderData.description,
        order_id: orderData.order.id,
        prefill: orderData.prefill,
        theme: { color: "#4f46e5" },
        handler: async (response) => {
          try {
            await api.post(`/payments/${invoiceId}/verify`, {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            toast.success("Payment successful!");
            refetch();
          } catch { toast.error("Verification failed. Contact support."); }
        },
        modal: { ondismiss: () => toast("Payment cancelled.", { icon: "ℹ️" }) },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      // Fallback to mock if Razorpay not configured
      toast("Using demo payment (Razorpay not configured).", { icon: "⚠️" });
      try {
        await api.put(`/payments/${invoiceId}/pay`, { paymentMethod: "Demo" });
        toast.success("Demo payment recorded!");
        refetch();
      } catch { toast.error("Payment failed"); }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" subtitle="Invoices and billing history" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Paid"    value={`₹${(totalPaid/100).toLocaleString("en-IN")}`}    sub="This year"   icon={CheckCircle} color="emerald" />
        <StatCard label="Outstanding"   value={`₹${(totalPending/100).toLocaleString("en-IN")}`} sub={`${payments.filter(p=>p.status==="Pending").length} invoices`} icon={AlertCircle} color="amber" />
        <StatCard label="Auto Invoice"  value="Monthly" sub="Generated on 1st"                   icon={Calendar}  color="indigo" />
      </div>
      <Card>
        <CardHeader title="Invoices" />
        {loading ? <div className="flex justify-center py-10"><Spinner /></div>
        : payments.length === 0 ? <EmptyState icon={CreditCard} title="No invoices yet" subtitle="Invoices appear here once created by your accountant." />
        : (
          <div className="divide-y divide-slate-50">
            {payments.map(inv => (
              <div key={inv._id} className="flex items-center justify-between px-5 py-4 flex-wrap gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{inv.description}</p>
                  <p className="text-xs text-slate-400">{inv.invoiceNumber} • {new Date(inv.createdAt).toLocaleDateString("en-IN")}</p>
                  {inv.transactionId && <p className="text-xs text-slate-400 font-mono mt-0.5">TXN: {inv.transactionId}</p>}
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">₹{((inv.amount+inv.tax)/100).toLocaleString("en-IN")}</p>
                    <p className="text-xs text-slate-400">incl. 18% GST</p>
                  </div>
                  <StatusBadge status={inv.status} />
                  {inv.status === "Pending" && (
                    <button onClick={() => handlePay(inv._id)} className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
                      <CreditCard size={12} /> Pay Now
                    </button>
                  )}
                  <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Download size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-4">Accepted Payment Methods</h3>
        <div className="flex flex-wrap gap-3">
          {["UPI / PhonePe / GPay","Net Banking","Credit Card","Debit Card","Razorpay"].map(m => (
            <div key={m} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-slate-50">{m}</div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
          <ShieldCheck size={12} /> All payments secured with 256-bit SSL via Razorpay
        </p>
      </Card>
    </div>
  );
};
export default PaymentsPage;
