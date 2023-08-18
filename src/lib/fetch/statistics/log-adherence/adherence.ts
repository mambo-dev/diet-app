import { log_adherence_schema } from "../../../schemas/schemas";
import { ServerResponse } from "../../../type";
import { z } from "zod";

interface ILogAdherence {
  access_token: string;
  adherence: z.infer<typeof log_adherence_schema>;
}

export async function log_adherence(
  logAdherence: ILogAdherence
): Promise<boolean | undefined> {
  const { access_token, adherence } = logAdherence;

  const res = await fetch(`/api/statistics/log-adherence`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Cookie: `access_token=${access_token}`,
    },
    body: JSON.stringify(adherence),
  });

  const data = (await res.json()) as ServerResponse<boolean>;

  if (data.error && !data.data) {
    if (data.error instanceof Array) {
      throw new Error(JSON.stringify(data.error));
    }

    throw new Error(data.error ?? "something unexpected happened");
  }
  return data.data;
}

type IEditAdherence = {
  access_token: string;
  adherence: z.infer<typeof log_adherence_schema>;
  adherence_id: number;
};

export async function edit_adherence(
  editProgress: IEditAdherence
): Promise<boolean | undefined> {
  const { access_token, adherence, adherence_id } = editProgress;

  const res = await fetch(
    `/api/statistics/log-adherence?adherence_id=${adherence_id}`,
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Cookie: `access_token=${access_token}`,
      },
      body: JSON.stringify(adherence),
    }
  );

  const data = (await res.json()) as ServerResponse<boolean>;

  if (data.error && !data.data) {
    if (data.error instanceof Array) {
      throw new Error(JSON.stringify(data.error));
    }

    throw new Error(data.error ?? "something unexpected happened");
  }
  return data.data;
}

type IDeleteAdherence = {
  access_token: string;
  adherence_id: number;
};

export async function delete_adherence(
  deleteProgress: IDeleteAdherence
): Promise<boolean | undefined> {
  const { access_token, adherence_id } = deleteProgress;

  const res = await fetch(
    `/api/statistics/log-adherence?adherence_id=${adherence_id}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Cookie: `access_token=${access_token}`,
      },
    }
  );

  const data = (await res.json()) as ServerResponse<boolean>;

  if (data.error && !data.data) {
    if (data.error instanceof Array) {
      throw new Error(JSON.stringify(data.error));
    }

    throw new Error(data.error ?? "something unexpected happened");
  }
  return data.data;
}
