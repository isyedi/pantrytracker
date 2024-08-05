'use client'

import { useState, useEffect } from 'react'
import { Container, Box, Stack, Typography, Button, Modal, TextField, IconButton, Grid, Paper} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { firestore } from '@/firebase'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { borders } from '@mui/system';

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}
export default function Home() {

const [inventory, setInventory] = useState([])
const [open, setOpen] = useState(false)
const [itemName, setItemName] = useState('')
const [searchQuery, setSearchQuery] = useState(''); // Add search query state

const updateInventory = async () => {
  const snapshot = query(collection(firestore, 'inventory'))
  const docs = await getDocs(snapshot)
  const inventoryList = []

  docs.forEach((doc)=> {
    inventoryList.push({ name: doc.id, ...doc.data() })
  })
  setInventory(inventoryList)
}

const addItem = async (item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { count } = docSnap.data()
    await setDoc(docRef, { count: count + 1})
  }
  else {
    await setDoc(docRef, { count: 1 })
  }
  await updateInventory()
}

const removeItem = async (item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { count } = docSnap.data()
    if (count === 1){
      await deleteDoc(docRef)
    }
    else {
      await setDoc(docRef, { count : count - 1 })
    }
  }
  await updateInventory()
}

const deleteItem = async (item) => {
  const docRef = doc(collection(firestore, 'inventory'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
      await deleteDoc(docRef)
  }
    await updateInventory()
}

const filteredInventory = inventory.filter(item =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
);


const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)


useEffect(() => {
  updateInventory()
}, [])

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));



  return (
    <Box
    sx={{
      display: 'fixed',
      // justifyContent: 'flex-start', // Aligns items at the start horizontally
      // alignItems: 'flex-start',     // Aligns items at the start vertically
      textAlign: 'left',         // Aligns text to the left
      height: '100vh', 
      width: '100vw',          // Adjust as needed
      bgcolor: '#FFE4C4'
    }}
    >

      {/* Title */}
      
      <Typography variant="h4"
      sx = {{
        p: 2,
        position: 'absolute',
        justifyContent: 'flex-start', // Aligns items at the start horizontally
        alignItems: 'flex-start',
        fontFamily: 'papyrus',
        color: "#800000"
      }}
      > 
        PantryTracker
      </Typography>

      <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      bgcolor=''
      gap={2}
      >



          {/* Pop Up when adding an item */}
          <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Item
              </Typography>
              <Stack width="100%" direction={'row'} spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    addItem(itemName)
                    setItemName('')
                    handleClose()
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>


        {/* Inventory Title */}
        
        <Box sx = {{bgcolor: ''}}>
        <Typography variant={'h3'} color={'black'} textAlign={'center'} sx = {{ fontFamily: 'papyrus', color: '#800000', p: 2 }}>
              Inventory
        </Typography>
        
        {/* Search Input */}
        <Box
          width="800px"
          height="65px"
          display={'fixed'}
          direction="column"
          sx = {{ bgcolor: '', justifyContent: 'center', alignItems: 'center'}}
        >
          <Stack width='100%' height='100%' direction = 'row' spacing = {2}>
            <TextField
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: '80%', height: '20%' }}
            /> 

            <Button variant="contained" onClick={handleOpen} sx = {{ m: 2, bgcolor: '#800000', width: '20%', height: '75%'}}>
              Add New Item
            </Button>
          </Stack>
        </Box>
        


        {/* Card Box Display */}
        <Box
          width="800px"
          height="500px"
          display={'flex'}
          // justifyContent={'center'}
          // alignItems={'center'}
          sx = {{flexGrow: 1, overflow: 'auto', border: '3px solid brown', p: 2, borderRadius: '16px'}}
        >
          <Grid container spacing = {2} >
          {filteredInventory.map(({name, count}) => (
            <Grid item xs={12} sm={6} md={4} key={name}>
              <Card sx={{ maxWidth: 300, maxheight: 300, bgcolor: 'beige' }}>
                {/* <CardMedia
                  sx={{ height: 140 }}
                  image="/app/images/cards/"
                  title=""
                /> */}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" align='center'>
                    { name }
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align='center'>
                    Quantity: {count}
                  </Typography>
                </CardContent>

                <CardActions >
                  <IconButton size="small" aria-label="add" onClick={() => addItem(name)}>
                      <AddIcon/>
                  </IconButton>
                  <IconButton size="small" aria-label="remove" onClick={() => removeItem(name)}>
                      <RemoveIcon/>
                  </IconButton>
                    <IconButton size="small" aria-label="delete" onClick={() => deleteItem(name)}>
                      <DeleteIcon/>
                  </IconButton>
                </CardActions>

              </Card>
            </Grid>
            ))}
            </Grid>
        </Box>
        
        






          {/* <Stack width="1200px" height="300px" spacing={2} overflow={'auto'}>
            {inventory.map(({name, count}) => (
              <Box
                key={name}
                width="100%"
                minHeight="100px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'red'}
                paddingX={5}
              >
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  Quantity: {count}
                </Typography>
                <IconButton aria-label="delete" onClick={() => removeItem(name)}>
                  <DeleteIcon/>
                </IconButton>
              </Box>
            ))}
          </Stack> */}
        </Box>
      </Box>

    </Box>
  )
}
