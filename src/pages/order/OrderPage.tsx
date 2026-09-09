import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {api} from "../../components/api/api.ts";
import type {IResponseOrderPing} from "../../interfaces/product/orderPingResponse.ts";
import axios from "axios";
// import type {IProductResponse} from "../../interfaces/product/productResponse.ts";


const OrderPage = () => {

    // const [orders, setOrders] = useState<[]>([]);
    const [pendingOrders, setPendingOrders] = useState<boolean>(true);
    const [countPings, setCounterPings] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>();
    const [totalOrders, setTotalOrders] = useState<number>();
    const {roundId} = useParams();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!roundId || !pendingOrders) {
            return;
        }

        let timeout_id: ReturnType<typeof setTimeout>;
        const get_orders = async () => {
            try {
                setCounterPings(prev => prev + 1);
                const resp = await api.get<IResponseOrderPing>(
                    "order/fta_ping_orders.php",
                    {
                        params: {
                            invrou_id: roundId,
                        }
                    }
                );
                console.log(resp)
                setTotalOrders(resp.data.data.total_orders)
                setTotalUsers(resp.data.data.total_users)
                if ((totalOrders && totalUsers) && totalOrders === totalUsers) {
                    console.log(totalOrders, totalUsers);
                    setPendingOrders(false);
                    console.log('alle orders zijn binnen.', resp.data.data);
                    return;
                }

                timeout_id = setTimeout(() => {
                    void get_orders();
                }, 2000);

            } catch (error: unknown) {
                console.error(error);

                setPendingOrders(false);
                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message ??
                        "De groep kon niet worden opgehaald."
                    );
                } else {
                    setErrorMessage(
                        "Er is een onverwachte fout opgetreden."
                    );
                }
            }
        };
        void get_orders();
        return () => {
            clearTimeout(timeout_id);
        };
    }, [pendingOrders, roundId]);

    if (errorMessage) {
        return (
            <main className="container py-4">
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            </main>
        );
    }
    return (
        <>

            <h1>Hello order page</h1>
            <p>Aantal pings: {countPings}</p>
            <p>Aantal orders: {totalOrders}</p>
            <p>Aantal personen: {totalUsers}</p>
        </>
    )
}
export default OrderPage;
