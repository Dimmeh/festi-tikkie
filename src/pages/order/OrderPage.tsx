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
    // const [orders, setOrders] = useState<IResponseOrders[]>([]);
    const {roundId} = useParams();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!roundId || !pendingOrders) {
            return;
        }

        let timeout_id: ReturnType<typeof setTimeout>;
        let is_cancelled = false;

        const get_orders = async () => {
            try {
                setCounterPings((prev) => prev + 1);

                const resp = await api.get<IResponseOrderPing>(
                    "order/fta_ping_orders.php",
                    {
                        params: {
                            invrou_id: roundId,
                        }
                    }
                );

                // OrderPage bestaat niet meer
                if (is_cancelled) {
                    return;
                }

                const total_orders = resp.data.data.total_orders;
                const total_users = resp.data.data.total_users;

                setTotalOrders(total_orders);
                setTotalUsers(total_users);

                if (total_orders === total_users) {
                    setPendingOrders(false);

                    console.log(
                        "Alle orders zijn binnen.",
                        resp.data.data
                    );

                    return;
                }

                timeout_id = setTimeout(() => {
                    void get_orders();
                }, 2000);
            }
            catch (error: unknown) {
                if (is_cancelled) {
                    return;
                }

                console.error(error);

                setPendingOrders(false);

                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message ??
                        "De orders konden niet worden opgehaald."
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
            is_cancelled = true;
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
            <main className="container py-4">
                {errorMessage && (
                    <div className="alert alert-danger">
                        {errorMessage}
                    </div>
                )}
                { totalOrders !== totalUsers ? (
                        <section className="row align-items-center mb-4">
                            <div className="col-12">
                                <h1>Hello order page</h1>
                                <p>Aantal pings: {countPings}</p>
                                <p>Aantal orders: {totalOrders}</p>
                                <p>Aantal personen: {totalUsers}</p>
                            </div>
                        </section>
                    ) : (
                        <section className="row align-items-center mb-4">
                            <div className="col-12">
                                {}
                            </div>
                        </section>
                    )
                }
            </main>
        </>
    )
}
export default OrderPage;
