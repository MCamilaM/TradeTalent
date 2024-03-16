import { User } from "./user.model";

export interface Reservation {
    uidTalent: string,
    dateOfReserve: string,
    user?:User
}