import OrderTrackingPage from './[orderCode]/page';

export default async function OrderListPage() {
  return (
    <OrderTrackingPage
      params={Promise.resolve({
        orderCode: 'list',
      })}
    />
  );
}