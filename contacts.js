const uniqid = require('uniqid');
const fs = require('fs').promises;
const path = require('path');
const { isArray } = require('util');
require('colors');

const contactsPath = path.join(__dirname, './db/contacts.json');

// Create methods for contacts
// Get array with contacts (For dev usage)
async function getContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    contactsList = JSON.parse(data);
    return contactsList;
  } catch (error) {
    return error;
  }
}

// Show all list contacts
async function listContacts() {
  try {
    const contactsList = await getContacts();
    if (!Array.isArray(contactsList)) {
      throw new Error(contactsList);
    }
    console.table(contactsList);
  } catch (error) {
    console.log(`${error}`.bgRed);
  }
}

// Show contact by ID
async function getContactById(contactId) {
  try {
    const contactsList = await getContacts();
    if (!Array.isArray(contactsList)) {
      throw new Error(contactsList);
    }

    const contactById = contactsList.find(contact => contact.id === contactId);

    if (contactById.length === 0) {
      console.log('We did not find contact!'.bgRed);
    } else {
      console.log('We found contact!'.bgGreen);
      console.table(contactById);
    }
  } catch (error) {
    console.log(`${error}`.bgRed.bold);
  }
}

// Remove contact by ID
async function removeContact(contactId) {
  try {
    const contactsList = await getContacts();
    if (!Array.isArray(contactsList)) {
      throw new Error(contactsList);
    }

    const sortedContacts = contactsList.filter(
      contact => contact.id !== contactId
    );

    if (sortedContacts.length === contactsList.length) {
      console.log('We did not find contact!'.bgRed);
    } else {
      await fs.writeFile(contactsPath, JSON.stringify(sortedContacts), 'utf-8');
      console.log(
        `We successfully deleted contact with id - ${contactId}!`.bgGreen
      );
      listContacts();
    }
  } catch (error) {
    console.log(`${error}`.bgRed.bold);
  }
}

// Add contact
async function addContact(name, email, phone) {
  try {
    const contactsList = await getContacts();
    if (!Array.isArray(contactsList)) {
      throw new Error(contactsList);
    }

    const contactForAdd = {
      id: uniqid(),
      name,
      email,
      phone,
    };

    const newContacts = [...contactsList, contactForAdd];

    await fs.writeFile(contactsPath, JSON.stringify(newContacts), 'utf-8');
    console.log(`We successfully added contact!`.bgGreen);
    listContacts();
  } catch (error) {
    console.log(`${error}`.bgRed.bold);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
