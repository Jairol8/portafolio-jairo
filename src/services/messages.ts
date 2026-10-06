import { supabase } from "../lib/supabase";

export type Message = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  area: string | null;
  reason: string | null;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type CreateMessageData = {
  name: string;
  email: string;
  company?: string;
  area: string;
  reason: string;
  subject: string;
  message: string;
};

export async function getMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
        id,
        name,
        email,
        company,
        area,
        reason,
        subject,
        message,
        read,
        created_at
      `,
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createMessage(
  message: CreateMessageData,
) {
  const { error } = await supabase
    .from("messages")
    .insert({
      name: message.name.trim(),
      email: message.email.trim(),
      company: message.company?.trim() || null,
      area: message.area,
      reason: message.reason,
      subject: message.subject,
      message: message.message.trim(),
    });

  if (error) {
    throw error;
  }
}

export async function markMessageAsRead(
  id: string,
  read: boolean,
) {
  const { error } = await supabase
    .from("messages")
    .update({
      read,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteMessage(id: string) {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}