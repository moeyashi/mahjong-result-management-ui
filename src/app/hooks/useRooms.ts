import { useState } from 'react';
import { RoomRepositoryImpl } from '../di';
import { Room } from '../domain/model';
import { RoomInteractor } from '../domain/usecase';

const roomInteractor = new RoomInteractor(RoomRepositoryImpl);

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const fetchRooms = async () => {
    setLoadingRooms(true);
    setRooms(await roomInteractor.list());
    setLoadingRooms(false);
  };
  const addRoom = async (roomName: string) => {
    const addedRoom = await roomInteractor.add(roomName);
    setRooms([...rooms, addedRoom]);
    await fetchRooms();
  };
  return {
    rooms,
    loadingRooms,
    fetchRooms,
    addRoom,
  };
};
