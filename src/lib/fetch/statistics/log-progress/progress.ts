import { cookies } from "next/headers";
import { ServerResponse } from "../../../type";
import { z } from "zod";
import { log_progress_schema } from "../../../schemas/schemas";

interface ILogProgress {
  access_token: string;
  progress: z.infer<typeof log_progress_schema>;
}

export async function log_progress(
  logProgress: ILogProgress
): Promise<boolean | undefined> {
  const { access_token, progress } = logProgress;

  const res = await fetch(`/api/statistics/log-progress`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Cookie: `access_token=${access_token}`,
    },
    body: JSON.stringify(progress),
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

type IEditProgress = {
  access_token: string;
  progress: z.infer<typeof log_progress_schema>;
  progress_id: number;
};

export async function edit_progress(
  editProgress: IEditProgress
): Promise<boolean | undefined> {
  const { access_token, progress, progress_id } = editProgress;

  const res = await fetch(
    `/api/statistics/log-progress?progress_id=${progress_id}`,
    {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Cookie: `access_token=${access_token}`,
      },
      body: JSON.stringify(progress),
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

type IDeleteProgress = {
  access_token: string;
  progress_id: number;
};

export async function delete_progress(
  deleteProgress: IDeleteProgress
): Promise<boolean | undefined> {
  const { access_token, progress_id } = deleteProgress;

  const res = await fetch(
    `/api/statistics/log-progress?progress_id=${progress_id}`,
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
