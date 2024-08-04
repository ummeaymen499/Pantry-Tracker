"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Paper,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import Link from "next/link";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "400px",
  bgcolor: "#ffffff", // White background for the modal
  border: "1px solid #00796b", // Teal border color
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  p: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPantry, setFilteredPantry] = useState([]);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
    setFilteredPantry(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredPantry(inventory);
    } else {
      const filteredItems = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPantry(filteredItems);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      bgcolor="#e0f7fa" // Light cyan background
      paddingBottom="2rem"
    >
      <Box
        width="100%"
        height="12vh"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#00796b" // Solid teal background
        color="white"
        sx={{
          padding: { xs: "0 2.7%", sm: "0 6%", md: "0 15%", lg: "0 19%" },
        }}
      >
        <Link href="/" passHref style={{ textDecoration: "none" }}>
          <Typography
            variant="h2"
            sx={{
              color: "white",
              textDecoration: "none",
              fontSize: { xs: "1rem", sm: "1.5rem", md: "1.8rem", lg: "2rem" },
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Text shadow for better visibility
            }}
            onClick={() => window.location.reload()}
          >
            Pantry Tracker
          </Typography>
        </Link>

        <Link
          href="https://ummeaymen-portfolio.vercel.app"
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "white",
              textDecoration: "none",
              fontSize: { xs: "1rem", sm: "1.5rem", md: "1.8rem", lg: "2rem" },
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Text shadow for better visibility
            }}
          >
            Umme Aymen
          </Typography>
        </Link>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Paper sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Add New Item
          </Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              id="item-name"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Paper>
      </Modal>

      <Box
        border="1px solid #00796b"
        borderRadius="8px"
        sx={{
          width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
        }}
      >
        <Stack
          direction="row"
          width="100%"
          spacing={2}
          padding="10px"
          bgcolor="#ffffff"
          borderBottom="1px solid #00796b"
        >
          <TextField
            id="search"
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ borderColor: "#00796b" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ height: "100%", padding: "10px" }}
          >
            <SearchIcon />
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            sx={{ height: "100%", padding: "10px" }}
          >
            Add New Item
          </Button>
        </Stack>

        <Box
          height="60px"
          width="100%"
          bgcolor="#00796b"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderTopLeftRadius="8px"
          borderTopRightRadius="8px"
          marginBottom="1rem"
        >
          <Typography
            variant="h4"
            style={{
              color: "#ffffff",
              textAlign: "center",
            }}
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem", lg: "1.8rem" },
              fontWeight: "bold",
            }}
          >
            Inventory Items
          </Typography>
        </Box>

        <Stack width="100%" spacing={2} padding="10px" overflow="auto">
          {filteredPantry.map(({ name, quantity }) => (
            <Box
              key={name}
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#ffffff"
              borderRadius="8px"
              paddingX={3}
              paddingY={2}
              boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#00796b",
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem", lg: "1.4rem" },
                }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#00796b",
                  fontWeight: "bold",
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem", lg: "1.4rem" },
                }}
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => addItem(name)}
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem", lg: "1rem" } }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(name)}
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem", lg: "1rem" } }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
