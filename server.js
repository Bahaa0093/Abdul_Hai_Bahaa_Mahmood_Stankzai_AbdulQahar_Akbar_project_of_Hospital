const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Setup SQLite database with Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // Saves data to a file called "database.sqlite"
});

// Models
const User = sequelize.define(
  'User',
  {
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { paranoid: true } // Enable paranoid for soft deletes
);

const Patient = sequelize.define(
  'Patient',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER },
  },
  { paranoid: true } // Enable paranoid for soft deletes
);

const Appointment = sequelize.define(
  'Appointment',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
  },
  { paranoid: true } // Enable paranoid for soft deletes
);

// Associations (removed the association with User for Patient and Appointment)
User.hasMany(Appointment, { onDelete: 'CASCADE' });
Appointment.belongsTo(User);

User.hasMany(Patient, { onDelete: 'CASCADE' });
Patient.belongsTo(User);

// Routes

// User Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({ include: [Appointment, Patient] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const user = await User.create({ name });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name; // Update user name
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy(); // Soft delete
    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { paranoid: false });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.restore(); // Restore soft-deleted user
    res.json({ message: 'User restored successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Patient Routes
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const { name, age } = req.body; // Removed userId

    const patient = await Patient.create({ name, age }); // Create the patient without userId
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;
    const patient = await Patient.findByPk(id);

    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    patient.name = name;
    patient.age = age;
    await patient.save();
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);

    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    await patient.destroy();
    res.json({ message: 'Patient deleted successfully', patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/patients/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id, { paranoid: false });

    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    await patient.restore();
    res.json({ message: 'Patient restored successfully', patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Appointment Routes
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.findAll(); // Fetch all appointments
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Appointment Routes
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, date } = req.body; // Removed userId

    const appointment = await Appointment.create({ name, date }); // Create the appointment without userId
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date } = req.body;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    appointment.name = name;
    appointment.date = date;
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    await appointment.destroy();
    res.json({ message: 'Appointment deleted successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/appointments/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id, { paranoid: false });

    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    await appointment.restore();
    res.json({ message: 'Appointment restored successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Database Sync and Server Start
sequelize
  .sync({ force: true }) // Force sync for testing; remove in production
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => console.error('Database sync error:', err));
