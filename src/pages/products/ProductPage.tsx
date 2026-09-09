import {useEffect, useState} from "react";
import axios from "axios";
import {api} from "../../components/api/api.ts";
import {Link, useNavigate, useParams} from "react-router-dom";
import type {IProductResponse} from "../../interfaces/product/productResponse.ts";
import type {IProductByAmount} from "../../interfaces/product/productByAmount.ts";
import type {ICreateOrderResponse} from "../../interfaces/product/createOrderResponse.ts";

const ProductPage = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const {eventId, roundId, groupId} = useParams();
    const [products, setProducts] = useState<IProductByAmount[]>([]);
    const navigate = useNavigate();
    const editProductAmount = (pro_id: number, amount: number) => {
        setProducts((prev_products) =>
            prev_products.map((product) =>
                product.pro_id === pro_id
                    ? {
                        ...product,
                        product_amount: amount
                    }
                    : product
            )
        );
    };

    const nextStep = async() => {
        if(!roundId || !groupId){
            return
        }
        const selectedProducts = products.filter(
            (product) => product.product_amount > 0
        )
        const formData = new FormData();
        formData.append('products', JSON.stringify(selectedProducts))
        formData.append("invrou_id", roundId)

        console.log(JSON.stringify(selectedProducts), roundId)
        try{
            const resp = await api.post<ICreateOrderResponse>('/order/fta_create_order.php', formData)
            if(resp.data.success){
                let route = `groups/${groupId}`;
                if(resp.data.data.is_creator){
                    route = `/groups/${groupId}/events/${eventId}/rounds/${roundId}/order`;
                }
                navigate(route);
            }
            console.log(resp);
        }
        catch(error:unknown){
            console.error(error);

            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message ??
                    "De order konden niet worden gemaakt."
                );
            } else {
                setErrorMessage(
                    "De order konden niet worden gemaakt."
                );
            }
        }

    }
    useEffect(() => {
        if (!eventId || !roundId || !groupId) {
            return;
        }
        let isCancelled = false;
        const getProducts = async () => {
            console.log("round_id", roundId);
            try {
                // invusr_status: '*' is het ophalen van joined en invited invitations.
                const resp = await api.get<IProductResponse>(
                    "/product/fta_get_products.php", {
                        params: {
                            round_id: roundId,
                        }
                    });


                if (isCancelled) {
                    return;
                }
                console.log(resp);
                if (resp.data.data.product_count > 0) {
                    const products_by_amount: IProductByAmount[] =
                        resp.data.data.products.map((product) => ({
                            ...product,
                            product_amount: 0
                        }));

                    setProducts(products_by_amount);
                }
            } catch (error: unknown) {
                if (isCancelled) {
                    return;
                }

                console.error(error);

                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message ??
                        "De ronden konden niet worden opgehaald."
                    );
                } else {
                    setErrorMessage(
                        "De ronden konden niet worden opgehaald."
                    );
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }
        void getProducts();
        return () => {
            isCancelled = true;
        };
    }, [eventId, roundId, groupId]);
    if (isLoading) {
        return (
            <main className="container py-4">
                <p>Producten laden...</p>
            </main>
        );
    }
    return (
        <main className="container py-4">
            {errorMessage && (
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            )}
            <section className="row align-items-center mb-4">
                <div className="col-12">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <h1 className="mb-0">
                            <Link
                                to="/groups"
                                className="btn btn-outline-primary"
                            >
                                ←
                            </Link> Producten
                        </h1>

                    </div>
                </div>
            </section>
            <section className="row align-items-center mb-4">
                <div className="col-12">
                    <p className="text-muted mb-1">
                        Producten
                    </p>
                </div>
            </section>
            <section className="row">
                <div className="col-12 mb-3">
                    <div className="row">
                        <div className="col-8">
                            <div className="row">
                                <div className="col-10">Product</div>
                                <div className="col-2">Prijs</div>
                            </div>
                        </div>
                    </div>
                </div>
                {products.map((product) => (
                    <div className="col-12 mb-3" key={product.pro_id}>
                        <div className="row">
                            <div className="col-8">
                                <div className="row">
                                    <div className="col-10">
                                        <p>{product.pro_name}</p>
                                        <p>{product.pro_description}</p>
                                    </div>
                                    <div className="col-2">
                                        <p>{product.pro_price}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <button
                                    type="button"
                                    className={`btn text-center btn-primary`}
                                    onClick={() => editProductAmount(product.pro_id, product.product_amount - 1)}
                                    disabled={product.product_amount === 0}
                                >
                                    -
                                </button>

                                <span>{product.product_amount}</span>

                                <button
                                    type="button"
                                    className={`btn text-center btn-primary`}
                                    onClick={() => editProductAmount(product.pro_id, product.product_amount + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </section>
            <section className="row">
                <div className="col-12">
                    <button type="button"
                            className="btn btn-primary"
                            disabled={!products.some((product) => product.product_amount > 0)}
                            onClick={()=> nextStep()}>Volgende</button>
                </div>
            </section>
        </main>
    )
}

export default ProductPage
