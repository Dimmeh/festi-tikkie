import {api} from "../../components/api/api.ts";
import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import type {ICreateRoundInvitationResponse} from "../../interfaces/round/createRoundInvitationResponse.ts";
import type {ILocationResponse} from "../../interfaces/location/locationResponse.ts";
import type {ILocation} from "../../interfaces/location/location.ts";

const LocationPage = () => {
    const {groupId, eventId} = useParams();
    const navigate = useNavigate();
    const [isStartingRound, setIsStartingRound] = useState(false);
    const [startRoundError, setStartRoundError] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
    const [locations, setLocations] = useState<ILocation[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const startRound = async (loc_id:number): Promise<void> => {
        if (isStartingRound || !groupId || !eventId || loc_id === 0) {
            return;
        }

        setIsStartingRound(true);
        setStartRoundError("");
        const formData = new FormData();
        formData.append(
            "group_id",
            groupId
        );
        formData.append(
            "event_id",
            eventId
        );
        formData.append(
            "location_id",
            loc_id.toString()
        );

        console.log(groupId, eventId, loc_id);
        try {
            const response =
                await api.post<ICreateRoundInvitationResponse>(
                    "/round/fta_create_round_invitation.php",
                    formData
                );
            navigate(
                `/groups/${groupId}/events/${eventId}/rounds/${response.data.data.invite_round_id}/products`
            );
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ??
                    "De ronde kon niet worden gestart.";

                setStartRoundError(message);

            } else {
                setStartRoundError(
                    "Er is een onverwachte fout opgetreden."
                );
            }
        } finally {
            setIsStartingRound(false);
        }
    }

    useEffect(()=>{
        if (!eventId) {
            return;
        }
        const getLocations = async () => {
            try{
                const resp = await api.get<ILocationResponse>('/location/fta_get_locations.php',
                    {
                        params: {
                            evn_id: eventId
                        }
                    }
                );
                setLocations(resp.data.data.locations);
            }
            catch(error:unknown){
                console.error(error);

                if (axios.isAxiosError(error)) {
                    setErrorMessage(
                        error.response?.data?.message ??
                        "De locaties konden niet worden opgehaald."
                    );
                } else {
                    setErrorMessage(
                        "De locaties konden niet worden opgehaald."
                    );
                }
            }
        }
        void getLocations();
    }, [eventId]);

    return(

        <>
            {startRoundError && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {startRoundError}
                </div>
            )}
            {errorMessage && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {errorMessage}
                </div>
            )}
            <main className="container py-4">
                <section className="row align-items-center mb-4">
                    <div className="col-12">
                        <p className="text-muted mb-1">
                            Groep
                        </p>

                        <div className="d-flex align-items-center flex-wrap gap-2">
                            <h1 className="mb-0">
                                <Link
                                    to="/groups"
                                    className="btn btn-outline-primary"
                                >
                                    ←
                                </Link> Kies een locatie
                            </h1>
                        </div>
                    </div>
                </section>
                <section className="row">
                    {locations.map((location) => (
                        <div className="col-12" key={location.proloc_id}>
                            <button type="button" className={`btn w-100 text-start ${selectedLocation === location.proloc_id ? "btn-primary" : "btn-outline-secondary" }`}
                                onClick={() =>
                                    setSelectedLocation(location.proloc_id)
                                }
                            >
                                {location.proloc_name}
                            </button>
                        </div>
                    ))}
                </section>
                <section className="row">
                    <div className="col-12">
                        <button
                            type="button"
                            className="btn btn-primary ms-3 me-2"
                            onClick={() => {
                                if (selectedLocation !== null) {
                                    void startRound(selectedLocation);
                                }
                            }}
                            disabled={selectedLocation === null}
                        >
                            Stuur uitnodigingen
                        </button>
                    </div>
                </section>
            </main>
        </>
    )
}

export default LocationPage;
