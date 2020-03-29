import { Button, Card, CardActions, CardContent, CardHeader, Grid, TextField, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import App from '../components/App';
import { firebaseDb, useUser } from '../lib/firebaseClient';

const RoomGridItem = ({key, title, ...props}) => (
  <Grid item={true} key={key} {...props} xs={12} sm={6} md={4} lg={3}>
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
  const router = useRouter();
  const { user } = useUser();
  const [isRoomsLoading, setIsRoomsLoading] = useState(true);
  const [rooms, setRooms] = useState<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>();
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newRoomError, setNewRoomError] = useState<string>('');
  useEffect(() => {
    let unmounted = false;
    const f = async () => {
      const newRooms = await firebaseDb.collection('rooms').get();
      if (!unmounted) {
        setRooms(newRooms);
        setIsRoomsLoading(false);
      }
    };
    f();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, []);
  const handleNewRoomNameChange = (e) => { setNewRoomName(e.target.value); };
  const handleAddRoomClick = async () => {
    const check = await firebaseDb.collection('rooms').where('name', '==', newRoomName).get();
    if (check.empty) {
      await firebaseDb.collection('rooms').add({
        name: newRoomName,
        created_at: Date.now(),
        created_by: user?.uid,
      });
      router.reload();
    } else {
      setNewRoomError('Room name is duplicated');
    }
  };
  if (isRoomsLoading) {
    return <p>loading</p>;
  }

  return(
    <App>
      <Typography variant='h1'>Rooms</Typography>
      <Grid container={true} spacing={1}>
        {rooms?.docs?.map((room) => <RoomGridItem key={room.id} title={room.data().name} />)}
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
