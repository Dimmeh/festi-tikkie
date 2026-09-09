import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import { api } from "../../components/api/api.ts";

import type { IGroup } from "../../interfaces/group/group.ts";

interface Product {
    pro_id: number;
    pro_name: string;
    pro_price: number;
    pro_description: string | null;
}

interface CreateRoundResponse {
    group: IGroup;
    products: Product[];
}

const CreateRoundPage = () => {
    const { groupId } = useParams<{ groupId: string }>();

    const [group, setGroup] = useState<IGroup | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (!groupId) {
            return;
        }

        let isCancelled = false;

        const getRoundData = async () => {
            try {
                const response = await api.get<CreateRoundResponse>(
                    "/round/fta_get_create_round_data.php",
                    {
                        params: {
                            group_id: groupId,
                        },
                    }
                );

                if (isCancelled) {
                    return;
                }

                setGroup(response.data.group);
                setProducts(response.data.products);
            } catch (error: unknown) {
                if (isCancelled) {
                    return;
                }

                if (axios.isAxiosError(error)) {
                    setServerError(
                        error.response?.data?.message ??
                        "De gegevens voor de ronde konden niet worden opgehaald."
                    );
                } else {
                    setServerError(
                        "Er is een onverwachte fout opgetreden."
                    );
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        void getRoundData();

        return () => {
            isCancelled = true;
        };
    }, [groupId]);

    if (!groupId) {
        return (
            <main className="container py-4">
                <div className="alert alert-danger" role="alert">
                    Er is geen geldige groep geselecteerd.
                </div>

                <Link to="/groups" className="btn btn-outline-secondary">
                    Terug naar groepen
                </Link>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main className="container py-4">
                <p className="mb-0">Ronde laden...</p>
            </main>
        );
    }

    if (serverError || !group) {
        return (
            <main className="container py-4">
                <div className="alert alert-danger" role="alert">
                    {serverError ?? "De groep werd niet gevonden."}
                </div>

                <Link
                    to={`/groups/${groupId}`}
                    className="btn btn-outline-secondary"
                >
                    Terug naar groep
                </Link>
            </main>
        );
    }

    return (
        <main className="container py-4">
            <header className="d-flex justify-content-between align-items-start gap-3 mb-4">
                <div>
                    <p className="text-muted mb-1">
                        {group.gro_name}
                    </p>

                    <h1 className="h2 mb-2">
                        Nieuwe ronde
                    </h1>

                    <p className="text-muted mb-0">
                        Selecteer per groepslid een drankje.
                    </p>
                </div>

                <Link
                    to={`/groups/${group.gro_id}`}
                    className="btn btn-outline-secondary"
                >
                    Annuleren
                </Link>
            </header>

            <section className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <h2 className="h5 mb-3">
                        Beschikbare producten
                    </h2>

                    {products.length === 0 ? (
                        <p className="text-muted mb-0">
                            Er zijn nog geen producten beschikbaar.
                        </p>
                    ) : (
                        <div className="row g-3">
                            {products.map((product) => (
                                <div
                                    key={product.pro_id}
                                    className="col-12 col-md-6"
                                >
                                    <article className="border rounded-3 p-3 h-100">
                                        <div className="d-flex justify-content-between gap-3">
                                            <div>
                                                <h3 className="h6 mb-1">
                                                    {product.pro_name}
                                                </h3>

                                                {product.pro_description && (
                                                    <p className="text-muted small mb-0">
                                                        {product.pro_description}
                                                    </p>
                                                )}
                                            </div>

                                            <strong className="text-nowrap">
                                                €{" "}
                                                {Number(product.pro_price).toFixed(2)}
                                            </strong>
                                        </div>
                                    </article>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default CreateRoundPage;
