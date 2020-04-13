import { Button, Card, CardActions, CardContent, CardHeader, Grid, TextField, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import App from '../components/App';
import { Room } from '../domain/model';
import { useRooms } from '../hooks';

const RoomGridItem = ({room, ...props}) => {
  const router = useRouter();
  const handleClick = () => router.push(`/room/${room.id}`, `/room/${room.name}`);
  return (
    <Grid item={true} {...props} xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardHeader
          title={room.name}
          action={<Button onClick={handleClick}>detail</Button>}
        />
        <CardContent>
          hoge
        </CardContent>
      </Card>
    </Grid>
  );
};

export default () => {
  // const router = useRouter();
  const { rooms, loadingRooms, addRoom } = useRooms();
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomError, setNewRoomError] = useState<string>('');
  const handleNewRoomNameChange = (e) => { setNewRoomName(e.target.value); };
  const handleAddRoomClick = async () => {
    try {
      await addRoom(newRoomName);
    } catch (e) {
      setNewRoomError(e.toString());
    }
  };
  if (loadingRooms) {
    return <p>loading</p>;
  }

  return(
    <App>
      <Typography variant='h1'>Rooms</Typography>
      <Grid container={true} spacing={1}>
        {rooms?.map((room: Room) => <RoomGridItem key={room.id} room={room} />)}
        <Grid item={true} key={'index-rooms-new'} xs={12}>
          <Card>
            <CardHeader
              title='New Room'
            />
            <CardContent>
              <TextField
                label='Room Name'
                onChange={handleNewRoomNameChange}
                required={true}
                error={!!newRoomError}
                helperText={newRoomError}
              />
            </CardContent>
            <CardActions>
              <Button onClick={handleAddRoomClick}>Add Room</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </App>
  );
};
