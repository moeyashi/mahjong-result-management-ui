import { useAuthState } from 'react-firebase-hooks/auth';
import useSWR from 'swr';
import { RoomRepositoryImpl } from '../di';
import { RoomInteractor } from '../domain/usecase';
import firebase from '../lib/firebaseClient';

const roomInteractor = new RoomInteractor(RoomRepositoryImpl);

export const useRooms = () => {
  const [ user ] = useAuthState(firebase.auth());
  const { data, mutate } = useSWR(['result', user], () => roomInteractor.list(user?.uid));
  const addRoom = async (roomName: string) => {
    if (typeof data === 'undefined') {
      throw new Error('data is loading');
    }
    const addedRoom = await roomInteractor.add(roomName);
    mutate([...data, addedRoom]);
  };
  return {
    rooms: data,
    loadingRooms: !data,
    addRoom,
  };
};
