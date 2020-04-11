import { Button, Card, CardActions, CardContent, CardHeader, Grid, TextField, Typography } from '@material-ui/core';
// import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import App from '../components/App';
import { useRooms } from '../hooks';

const RoomGridItem = ({key, title, ...props}) => (
  <Grid item={true} {...props} key={key} xs={12} sm={6} md={4} lg={3}>
    <Card>
      <CardHeader
        title={title}
        action={<Button>detail</Button>}
      />
      <CardContent>
        hoge
      </CardContent>
    </Card>
  </Grid>
);

export default () => {
  // const router = useRouter();
  const { rooms, loadingRooms, fetchRooms, addRoom } = useRooms();
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomError, setNewRoomError] = useState<string>('');
  useEffect(() => {
    fetchRooms();
  }, []);
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
        {rooms?.map((room) => <RoomGridItem key={room.id} title={room.name} />)}
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
