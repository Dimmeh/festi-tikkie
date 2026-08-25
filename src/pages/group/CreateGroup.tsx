import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {useState} from "react";
import {api} from "../../components/api/api.ts";
import useAuth from "../../components/auth/useAuth.ts";
import GroupForm from "../../components/forms/GroupForm.tsx";
import type {IGroupFormValues} from "../../interfaces/group/groupFormValues.ts";

const CreateGroupPage = () => {
    const { user } = useAuth()
    // const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<IFormGroupInput>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();

    const createGroup = async (data: IGroupFormValues) => {
        setServerError(null);
        setIsSubmitting(true);
        const photoUrl = data.gro_profile_photo_url[0];
        const formData = new FormData();
        console.log(data)
        formData.append('name', data.gro_name);
        formData.append('member_ids', data?.gro_members ? data.gro_members.toString() : '[]');
        formData.append('creator_id', user?.usr_id.toString() ?? '');
        formData.append('profile_photo', photoUrl);

        try {
            await api.post(`/group/fta_create_group.php`, formData)
            navigate('/overview', { replace: true, state: {
                successMessage: `Groep '${data.gro_name}' is aangemaakt.`
            } })
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
                <GroupForm
                    defaultValues={{
                        gro_name: "",
                        gro_profile_photo_url: "",
                        gro_creator_id: "",
                        gro_members: ""
                    }}
                    isSubmitting={isSubmitting}
                    onSubmit={createGroup}
                    onServerError={serverError}
                    hasFriendList={[]} />
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
