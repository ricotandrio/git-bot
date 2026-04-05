import express, { Request, Response } from 'express';
import { logger } from '@/utils';

type GithubWebhookPayload = {
  action?: string;
  repository?: {
    name?: string;
    full_name?: string;
  };
  sender?: {
    login?: string;
  };
};

function handleGithubWebhook(req: Request, res: Response): void {
  const event = req.header('x-github-event');
  const deliveryId = req.header('x-github-delivery');

  if (!event) {
    res.status(400).json({
      ok: false,
      error: 'Missing x-github-event header',
    });
    return;
  }

  const payload = (req.body ?? {}) as GithubWebhookPayload;

  if (event === 'ping') {
    logger.info({ deliveryId }, 'Received GitHub webhook ping');
    res.status(200).json({ ok: true, message: 'pong' });
    return;
  }

  logger.info(
    {
      event,
      deliveryId,
      action: payload.action,
      repository: payload.repository?.full_name ?? payload.repository?.name,
      sender: payload.sender?.login,
    },
    'Received GitHub webhook event',
  );

  // For now we acknowledge webhook delivery and log payload metadata.
  // Domain handling can be plugged in here as use cases/events grow.
  res.status(202).json({ ok: true, event });
}

export async function startServer(port: number): Promise<void> {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      service: 'git-bot-api',
      status: 'ok',
    });
  });

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.post('/webhooks/github', handleGithubWebhook);
  app.post('/api/webhooks/github', handleGithubWebhook);

  await new Promise<void>((resolve) => {
    app.listen(port, () => {
      logger.info({ port }, 'API server started');
      resolve();
    });
  });
}
