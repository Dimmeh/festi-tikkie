import { Link } from "react-router-dom";

import useAuth from "../../components/auth/useAuth.ts";
import config from "../../../custom.config.ts";

const AccountPage = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <main className="container py-4">
                <p>Accountgegevens laden...</p>
            </main>
        );
    }

    const profilePhotoUrl = user.usr_profile_photo_url
        ? config.baseUrl + user.usr_profile_photo_url
        : null;

    return (
        <main className="container py-4">
            <section className="row align-items-center mb-4">
                <div className="col">
                    <p className="text-muted mb-1">
                        Account
                    </p>

                    <h1 className="mb-0">
                        Jouw profiel
                    </h1>
                </div>

                <div className="col-auto">
                    <Link
                        to="/overview"
                        className="btn btn-outline-secondary"
                    >
                        Terug naar dashboard
                    </Link>
                </div>
            </section>

            <section className="row g-4">
                <div className="col-12 col-lg-4">
                    <div className="card h-100">
                        <div className="card-body text-center">
                            {profilePhotoUrl ? (
                                <img
                                    src={profilePhotoUrl}
                                    alt={`Profielfoto van ${user.usr_name}`}
                                    className="rounded-circle object-fit-cover mb-3"
                                    width="160"
                                    height="160"
                                />
                            ) : (
                                <div
                                    className="
                                        rounded-circle
                                        bg-light
                                        d-flex
                                        align-items-center
                                        justify-content-center
                                        mx-auto
                                        mb-3
                                    "
                                    style={{
                                        width: "160px",
                                        height: "160px",
                                    }}
                                >
                                    <span className="display-4 text-muted">
                                        {user.usr_name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>
                                </div>
                            )}

                            <h2 className="h4 mb-1">
                                {user.usr_name}
                            </h2>

                            <p className="text-muted mb-3">
                                {user.usr_email}
                            </p>

                            <Link
                                to="/account/edit"
                                className="btn btn-primary"
                            >
                                Bewerk profiel
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-8">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h2 className="h5 mb-4">
                                Accountgegevens
                            </h2>

                            <div className="row g-4">
                                <div className="col-12 col-md-6">
                                    <p className="text-muted mb-1">
                                        Naam
                                    </p>

                                    <p className="fw-semibold mb-0">
                                        {user.usr_name}
                                    </p>
                                </div>

                                <div className="col-12 col-md-6">
                                    <p className="text-muted mb-1">
                                        E-mailadres
                                    </p>

                                    <p className="fw-semibold mb-0">
                                        {user.usr_email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-body">
                            <h2 className="h5 mb-2">
                                Jouw vriendcode
                            </h2>

                            <p className="text-muted">
                                Deel deze code met vrienden zodat zij jou
                                kunnen toevoegen aan een groep.
                            </p>

                            <div className="d-flex flex-wrap align-items-center gap-3">
                                <span className="display-6 fw-bold mb-0">
                                    {user.usr_code}
                                </span>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => {
                                        void navigator.clipboard.writeText(
                                            String(user.usr_code)
                                        );
                                    }}
                                >
                                    Kopieer code
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body">
                            <h2 className="h5">
                                Accountacties
                            </h2>

                            <p className="text-muted">
                                Je kunt hier je profiel aanpassen of
                                uitloggen.
                            </p>

                            <div className="d-flex flex-wrap gap-2">
                                <Link
                                    to="/account/edit"
                                    className="btn btn-primary"
                                >
                                    Bewerk profiel
                                </Link>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={logout}
                                >
                                    Uitloggen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AccountPage;
