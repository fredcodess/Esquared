const mongodb = require("mongodb");
const db = require("../data/database");

class Contact {
  constructor(contactDocument) {
    const { fullname, email, subject, message } = contactDocument;
    this.fullname = fullname;
    this.email = email;
    this.subject = subject;
    this.message = message;
  }

  async contact() {
    await db.getDb().collection("enquiries").insertOne({
      fullname: this.fullname,
      email: this.email,
      subject: this.subject,
      message: this.message,
    });
  }

  static async findAll() {
    const contacts = await db.getDb().collection("enquiries").find().toArray();

    return contacts.map(function (contactDocument) {
      return new Contact(contactDocument);
    });
  }

  static async findById(contactId) {
    let contId;
    try {
      contId = new mongodb.ObjectId(contactId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const contact = await db
      .getDb()
      .collection("enquiries")
      .findOne({ _id: contId });

    if (!contact) {
      const error = new Error("Could not find contact with provided id.");
      error.code = 404;
      throw error;
    }

    return new Product(contact);
  }

  static async saveResponse(contactId, response) {
    try {
      const contId = new mongodb.ObjectId(contactId); // Convert string to ObjectId
      await db
        .getDb()
        .collection("enquiries")
        .updateOne(
          { _id: contId }, // Find the document by _id
          { $set: { response: response, responded: true } }
        );
    } catch (error) {
      throw new Error("Failed to save response: " + error.message);
    }
  }
}

module.exports = Contact;
