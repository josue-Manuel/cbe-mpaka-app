export type MemberGender = 'M' | 'F' | 'Other' | 'PreferNotToSay';

export type MemberGroup = 
  | 'Chorale' 
  | 'Intercession' 
  | 'Jeunesse' 
  | 'École du Dimanche' 
  | 'Maman CBE' 
  | 'Papa CBE' 
  | 'Protocole' 
  | 'Évangélisation' 
  | 'Autre';

export type MemberFunction = 
  | 'Membre' 
  | 'Responsable' 
  | 'Encadreur' 
  | 'Diacre' 
  | 'Ancien' 
  | 'Pasteur';

export interface MemberProfile {
  id: string;
  firstName: string;
  lastName: string;
  gender?: MemberGender;
  phone?: string;
  email?: string;
  birthDate?: string;
  function: MemberFunction;
  group: MemberGroup;
  role: 'admin' | 'member';
  status: 'active' | 'pending' | 'blocked';
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  privacyAccepted: boolean;
  favoriteMeditations?: string[];
}
