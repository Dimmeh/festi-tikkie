import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import {useState} from "react";
import {api} from "../../components/api/api.ts";
import type {IFormGroupInput} from "../../interfaces/formGroupInput.ts";
import * as React from "react";
import type {IUser} from "../../interfaces/user.ts";
import config from "../../../custom.config.ts";
import useAuth from "../../components/auth/useAuth.ts";

const CreateGroupPage = () => {
    const { user } = useAuth()
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<IFormGroupInput>();
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isFriendCodeValid, setIsFriendCodeValid] = useState<boolean>(false);
    const [friendCode, setFriendCode] = useState<string | null>(null);
    const [friendList, setFriendList] = useState<IUser[]>([]);

    const onSubmit = async (data: IFormGroupInput) => {
        setServerError(null);
        const photoUrl = data.profilePhotoUrl[0];
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('member_ids', JSON.stringify(friendList));
        formData.append('creator_id', user?.usr_id.toString() ?? '');
        formData.append('profile_photo', photoUrl);
        console.log(formData)
        console.log({
            profile: photoUrl,
            name: data.name,
            memberIds: friendList,
            creatorIds: user?.usr_id.toString()
        })
        try {
            const resp = await api.post(`/fta_create_group.php`, formData)
            console.log(resp)
            navigate('/overview', { replace: true })
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ??
                    "Inloggen is mislukt.";

                setServerError(message);
            } else {
                setServerError(
                    "Er is een onverwachte fout opgetreden."
                );
            }
        }
    }

    const searchFriend = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        setServerError(null);

        if (!friendCode) {
            return;
        }

        try {
            const response = await api.get<{ user: IUser }>(
                "/fta_friendcode.php",
                {
                    params: {
                        friendcode: friendCode,
                    },
                }
            );

            const foundUser = response.data.user;

            setFriendList((currentFriendList) => {
                const friendAlreadyExists = currentFriendList.some(
                    (friend) => friend.usr_id === foundUser.usr_id
                );

                if (friendAlreadyExists) {
                    setServerError(
                        "Deze gebruiker staat al in de vriendenlijst."
                    );

                    return currentFriendList;
                }
                const el = document.querySelector("#groupFriendList") as HTMLInputElement
                if(el){
                    el.value = "";
                }
                return [...currentFriendList, foundUser];
            });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setServerError(
                    error.response?.data?.message ??
                    "Ongeldige friendcode."
                );
            } else {
                setServerError(
                    "Er is een onverwachte fout opgetreden."
                );
            }
        }
    };

    const watchInputSearchFriend = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const isValid = value.length === 6;
        setIsFriendCodeValid(isValid);
        setFriendCode(isValid ? value : null);
    }

    const friendListItems = friendList.map(friend =>
        <div key={friend.usr_id} className="row">
            <div className="col-2">
                <img className="w-100" src={config.baseUrl + friend.usr_profile_photo_url} alt=""/>
            </div>
            <div className="col-8">
                <p className="mb-0">{friend.usr_name}</p>
                <p className="mb-0">{friend.usr_code}</p>
            </div>
            <div className="col-2">
                <button className="btn btn-danger" onClick={() => deleteFromFriendList(friend.usr_id)}>Verwijderen</button>
            </div>
        </div>
    );

    const deleteFromFriendList = (userId:number) => {
        setFriendList(current =>
            current.filter(friend => friend.usr_id !== userId)
        );
    }

    return (
        <>
            <div id="create-group-form-container" className="form-container">
                <div className="col-12 mb-3">
                    <Link to="/overview">
                        <button type="button" className="btn btn-primary">
                            Terug naar overzicht
                        </button>
                    </Link>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label
                            htmlFor="name"
                            className="form-label"
                        >
                            Naam
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            {...register("name", {
                                required: "Vul een groepsnaam in.",
                            })}
                        />

                        {errors.name && (
                            <p className="text-danger">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label
                            htmlFor="groupProfilePhotoUrl"
                            className="form-label"
                        >
                            Profielfoto
                        </label>

                        <input className="form-control"
                               id="groupProfilePhotoUrl"
                               type="file"
                               accept="image/*"
                               {...register('profilePhotoUrl', {required: true})} />

                        {errors.profilePhotoUrl && (
                            <p className="text-danger">
                                {errors.profilePhotoUrl.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-3">
                        <label
                            htmlFor="groupFriendList"
                            className="form-label"
                        >
                            Vriendenlijst
                        </label>

                        <input className="form-control"
                               id="groupFriendList"
                               type="text"
                               maxLength={6}
                               onChange={watchInputSearchFriend}
                        />
                        <button className="btn btn-primary" disabled={!isFriendCodeValid} onClick={searchFriend}>Toevoegen</button>
                        <div className="container-fluid">
                            {friendListItems}
                        </div>
                    </div>


                    {serverError && (
                        <div className="alert alert-danger">
                            {serverError}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Bezig met aanmaken..." : "Aanmaken"}
                    </button>
                </form>
            </div>
            <div className="row">
                <div className="col-12"><p>796129</p></div>
                <div className="col-12"><p>552531</p></div>
                <div className="col-12"><p>715402</p></div>
                <div className="col-12"><p>424777</p></div>
                <div className="col-12"><p>316075</p></div>
                <div className="col-12"><p>615559</p></div>
                <div className="col-12"><p>099325</p></div>
            </div>
        </>
    )
}

export default CreateGroupPage;
