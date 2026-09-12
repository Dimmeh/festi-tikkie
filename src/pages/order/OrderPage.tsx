import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {api} from "../../components/api/api.ts";
import type {IResponseOrderPing} from "../../interfaces/product/orderPingResponse.ts";
import axios from "axios";
import type {IOrderResponse} from "../../interfaces/order/orderResponse.ts";
import type {IOrderSummary} from "../../interfaces/order/orderSummary.ts";
import config from "../../../custom.config.ts";
import type {IUserOrder} from "../../interfaces/order/userOrder.ts";


const OrderPage = () => {

    // const [orders, setOrders] = useState<[]>([]);
    const [pendingOrders, setPendingOrders] = useState<boolean>(true);
    const [viewSummary, setViewSummary] = useState<boolean>(true);
    const [countPings, setCounterPings] = useState<number>(0);
    const [totalUsers, setTotalUsers] = useState<number>();
    const [totalOrders, setTotalOrders] = useState<number>();
    const [totalPrice, setTotalPrice] = useState<string>();
    const [ordersWithUsers, setOrdersWithUsers] = useState<IUserOrder[]>([]);
    const [orderSummary, setOrderSummary] = useState<IOrderSummary[]>([]);
    const {roundId} = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const wrapUpRound = async() =>{
        if(!roundId){
            return;
        }
        const formData = new FormData();
        formData.append("order_with_users", JSON.stringify(ordersWithUsers))
        formData.append("invrou_id", roundId)
        try{
            await api.post(`/round/fta_wrap_up_round.php`, formData)
            navigate('/overview', { replace: true, state: {
                successMessage: `Ronde is afgerond.`
            } })
        }
        catch(error:unknown){
            console.error(error);

            setPendingOrders(false);

            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message ??
                    "De orde kan niet worden afgerond."
                );
            } else {
                setErrorMessage(
                    "Er is een onverwachte fout opgetreden."
                );
            }
        }
    }
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
                    const response = await api.get<IOrderResponse>('order/fta_get_orders.php', {
                        params: {
                            invrou_id: roundId,
                        }
                    })
                    const summary = response.data.data.summary
                    setOrderSummary(summary)
                    const totalPrice = summary.reduce(
                        (total, order) => total + Number(order.pro_total_price),
                        0.00
                    );
                    setTotalPrice(totalPrice.toFixed(2));
                    const orders = response.data.data.orders
                    const arr: IUserOrder[] = [];

                    orders.forEach((order) => {
                        const existing_user = arr.find(
                            (user) => user.usr_id === order.usr_id
                        );

                        if (!existing_user) {
                            const new_user: IUserOrder = {
                                usr_id: order.usr_id,
                                usr_name: order.usr_name,
                                usr_profile_photo_url: order.usr_profile_photo_url,
                                usr_email: order.usr_email,
                                usr_total_price: order.pro_price,
                                products: [
                                    {
                                        pro_id: order.pro_id,
                                        pro_name: order.pro_name,
                                        pro_price: order.pro_price,
                                        pro_total_price: (
                                            order.ordpro_amount * Number(order.pro_price)
                                        ).toFixed(2),
                                        ordpro_amount: order.ordpro_amount,
                                    }
                                ]
                            };

                            arr.push(new_user);

                            return;
                        }

                        const existing_product = existing_user.products.find(
                            (product) => product.pro_id === order.pro_id
                        );

                        if (existing_product) {
                            existing_product.ordpro_amount += order.ordpro_amount;

                            existing_product.pro_total_price = (
                                existing_product.ordpro_amount *
                                Number(existing_product.pro_price)
                            ).toFixed(2);
                        } else {
                            existing_user.products.push({
                                pro_id: order.pro_id,
                                pro_name: order.pro_name,
                                pro_price: order.pro_price,
                                pro_total_price: (
                                    order.ordpro_amount * Number(order.pro_price)
                                ).toFixed(2),
                                ordpro_amount: order.ordpro_amount,
                            });
                        }
                        existing_user.usr_total_price = (Number(existing_user.usr_total_price) + Number(order.pro_price)).toFixed(2);
                    });

                    console.log(JSON.stringify(arr));
                    setOrdersWithUsers(arr);
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
    }, [orderSummary, pendingOrders, roundId]);

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
                {
                    totalOrders !== totalUsers ? (
                        <section className="row align-items-center mb-4">
                            <div className="col-12">
                                <h1>Hello order page</h1>
                                <p>Aantal pings: {countPings}</p>
                                <p>Aantal orders: {totalOrders}</p>
                                <p>Aantal personen: {totalUsers}</p>
                            </div>
                        </section>
                    ) : (
                        viewSummary ? (
                            <section className="row align-items-center mb-4">
                                <div className="col-12">
                                    {orderSummary.map((order: IOrderSummary, index: number) => (
                                        <div className="row mb-3" key={index}>
                                            <div className="col-1">
                                                <p className="mb-0">{order.pro_total_amount}x</p>
                                            </div>
                                            <div className="col-7">
                                                <p className="mb-0">{order.pro_name}</p>
                                            </div>
                                            <div className="col-2">
                                                <p className="mb-0 text-muted">{order.pro_price}</p>
                                            </div>
                                            <div className="col-2 text-end">
                                                <p className="mb-0">{order.pro_total_price}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="row mt-3 border-top-dashed pt-3">
                                        <div className="col-10">
                                            <p className="mb-0">Totaal</p>
                                        </div>
                                        <div className="col-2">
                                            <p className="mb-0 text-end">{totalPrice}</p>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            <button type="button"
                                                    className="btn btn-primary"
                                                    onClick={()=> setViewSummary(false)}>Volgende</button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <section className="row align-items-center mb-4">
                                <div className="col-12">
                                    {ordersWithUsers.map((order, index) => (
                                        <div className="row mb-3" key={index}>
                                            <div className="col-12">
                                                <div className="row mb-3">
                                                    <div className="col-2 d-flex align-items-center">
                                                        <img
                                                            src={config.baseUrl + order.usr_profile_photo_url}
                                                            alt={`Profielfoto van ${order.usr_name}`}
                                                            className="w-100 rounded-circle object-fit-cover"
                                                        />
                                                    </div>
                                                    <div className="col-8 d-flex align-items-center">
                                                        <p className="mb-0"><b>{order.usr_name}</b></p>
                                                    </div>
                                                    <div className="col-2 d-flex align-items-center justify-content-end">
                                                        <p className="mb-0 text-end"><b>{order.usr_total_price}</b></p>
                                                    </div>
                                                </div>
                                                {order.products.map((product, index_product) => (
                                                    <div className="row text-muted" key={index_product}>
                                                        <div className="col-2">
                                                            <p className="mb-0 text-end ">{product.ordpro_amount}x</p>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="mb-0">{product.pro_name}</p>
                                                        </div>
                                                        <div className="col-2">
                                                            <p className="mb-0 text-end">{product.pro_price}</p>
                                                        </div>
                                                        <div className="col-2">
                                                            <p className="mb-0 text-end">{product.pro_total_price}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="row">
                                        <div className="col-12">
                                            <button type="button"
                                                    className="btn btn-primary"
                                                    onClick={()=> wrapUpRound()}>Ronde afronden</button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )
                    )
                }
            </main>
        </>
    )
}
export default OrderPage;
