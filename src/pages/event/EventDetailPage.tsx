// import {useParams} from "react-router-dom";
// import {useEffect, useState} from "react";
// import {api} from "../../components/api/api.ts";
// import axios from "axios";
//
// const EventDetailPage = () => {
//     const [isErrorMessage, setErrorMessage] = useState("");
//     const {groupId} = useParams();
//     useEffect(() => {
//         if(!groupId){
//             return;
//         }
//
//         let isCancelled = false;
//         const getEventsByGroupId = async() => {
//             try {
//                 const response =
//                     await api.get<>(
//                         "/event/fta_get_event.php",
//                         {
//                             params:{
//                                 groupId: groupId,
//                             }
//                         }
//                     );
//                 if(isCancelled){
//                     return;
//                 }
//
//                 setEvents()
//             } catch (error: unknown) {
//                 console.error(error);
//
//                 if (axios.isAxiosError(error)) {
//                     const message =
//                         error.response?.data?.message ??
//                         "De ronde kon niet worden gestart.";
//
//                     setErrorMessage(message);
//                 } else {
//                     setErrorMessage(
//                         "Er is een onverwachte fout opgetreden."
//                     );
//                 }
//             }
//         }
//         void getEventsByGroupId();
//     }, [groupId]);
//     return (
//         <>
//             {isErrorMessage && (
//                 <div
//                     className="alert alert-danger"
//                     role="alert"
//                 >
//                     {isErrorMessage}
//                 </div>
//             )}
//         </>
//     )
// }
//
// export default EventDetailPage;
