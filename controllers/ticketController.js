const asyncHandler = require("express-async-handler");

const User = require("../models/userModels");
const Ticket = require("../models/ticketModel");

const getTickets = asyncHandler(async (req, res) => {
  //get user using id in the jwt
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const tickets = await Ticket.find({ user: req.user.id });
  res.status(200).json(tickets);
});

const getTicket = asyncHandler(async (req, res) => {
  //get user using id in the jwt
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket Not found"); 
  }
  if (ticket.user.toString() != req.user.id) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  res.status(200).json(ticket);
});

const createTicket = asyncHandler(async (req, res) => {
  const { course, description } = req.body;
  if (!course || !description) {
    res.status(400);
    throw new Error("Please add a product and description");
  }
  const user = await User?.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const ticket = await Ticket.create({
    course,
    description,
    user: req?.user?.id,
    status: "new",
  });
  res.status(201).json(ticket);
});

const deleteTicket = asyncHandler(async (req, res) => {
  //get user using id in the jwt
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket Not found");
  }
  if (ticket.user.toString() != req.user.id) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  await ticket.remove();
  res.status(200).json({ success: true });
});
const updateTicket = asyncHandler(async (req, res) => {
  //get user using id in the jwt
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error("Ticket Not found");
  }
  if (ticket.user.toString() != req.user.id) {
    res.status(401);
    throw new Error("Not Authorized");
  }
  const updateTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updateTicket);
});

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
};