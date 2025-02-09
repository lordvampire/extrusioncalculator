import React, { useEffect, useState } from "react";
import { getAnlagen, createAnlage, deleteAnlage } from "../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Container,
  Grid,
  Card,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Anlagen = () => {
  const [anlagen, setAnlagen] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAnlage, setNewAnlage] = useState({
    name: "",
    bolzendurchmesser: "",
    containerdurchmesser: "",
    max_bolzenlaenge: "",
    max_auszugslaenge: "",
    max_stempelgeschwindigkeit: "",
    max_profilbreite: "",
    totzeit: "",
    max_pullergeschwindigkeit: "",
    max_strangzahl: "",
    rampenverlust: "",
  });

  useEffect(() => {
    getAnlagen()
      .then(setAnlagen)
      .catch((error) => console.error("Fehler beim Laden der Anlagen:", error));
  }, []);

  const handleCreateAnlage = async () => {
    try {
      const createdEntry = await createAnlage(newAnlage);
      setAnlagen((prev) => [...prev, createdEntry]);
      setNewAnlage({
        name: "",
        bolzendurchmesser: "",
        containerdurchmesser: "",
        max_bolzenlaenge: "",
        max_auszugslaenge: "",
        max_stempelgeschwindigkeit: "",
        max_profilbreite: "",
        totzeit: "",
        max_pullergeschwindigkeit: "",
        max_strangzahl: "",
        rampenverlust: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Fehler beim Erstellen der Anlage:", error);
    }
  };

  const handleDeleteAnlage = async (id) => {
    try {
      await deleteAnlage(id);
      setAnlagen((prev) => prev.filter((anlage) => anlage.id !== id));
    } catch (error) {
      console.error("Fehler beim Löschen der Anlage:", error);
    }
  };

  return (
    <Container>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Card elevation={3} sx={{ padding: 3, marginTop: 3 }}>
            <Typography variant="h4" gutterBottom>
              Extrusionsanlagen
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
              Neue Anlage hinzufügen
            </Button>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Bolzendurchmesser (mm)</TableCell>
                    <TableCell>Containerdurchmesser (mm)</TableCell>
                    <TableCell>Max. Bolzenlänge (mm)</TableCell>
                    <TableCell>Max. Auszugslänge (mm)</TableCell>
                    <TableCell>Max. Stempelgeschwindigkeit (mm/s)</TableCell>
                    <TableCell>Max. Profilbreite (mm)</TableCell>
                    <TableCell>Totzeit (s)</TableCell>
                    <TableCell>Max. Pullergeschwindigkeit (m/min)</TableCell>
                    <TableCell>Max. Strangzahl</TableCell>
                    <TableCell>Rampenverlust</TableCell>
                    <TableCell>Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {anlagen.map((anlage) => (
                    <TableRow key={anlage.id}>
                      <TableCell>{anlage.name}</TableCell>
                      <TableCell>{anlage.bolzendurchmesser}</TableCell>
                      <TableCell>{anlage.containerdurchmesser}</TableCell>
                      <TableCell>{anlage.max_bolzenlaenge}</TableCell>
                      <TableCell>{anlage.max_auszugslaenge}</TableCell>
                      <TableCell>{anlage.max_stempelgeschwindigkeit}</TableCell>
                      <TableCell>{anlage.max_profilbreite}</TableCell>
                      <TableCell>{anlage.totzeit}</TableCell>
                      <TableCell>{anlage.max_pullergeschwindigkeit}</TableCell>
                      <TableCell>{anlage.max_strangzahl}</TableCell>
                      <TableCell>{anlage.rampenverlust}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDeleteAnlage(anlage.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
      {/* Dialog für neue Anlage */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Neue Anlage hinzufügen</DialogTitle>
        <DialogContent>
          {Object.keys(newAnlage).map((key) => (
            <TextField
              key={key}
              label={key.replace("_", " ").toUpperCase()}
              fullWidth
              margin="dense"
              value={newAnlage[key]}
              onChange={(e) => setNewAnlage({ ...newAnlage, [key]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button variant="contained" onClick={handleCreateAnlage}>
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Anlagen;
