import { drizzle } from "drizzle-orm/d1";
import { getPlatformProxy } from "wrangler";
import * as schema from "../schema";

import type { AppBindings } from "../../types";

import states from "./states.json" with {type: "json"};

// Helper function due to limitations on bulk inserts on d1
// https://github.com/drizzle-team/drizzle-orm/issues/2479#issuecomment-2254352608
async function batchInsert<T>(_db: any, table: any, items: T[], chunkSize = 32) {
    for (let i = 0; i < items.length; i += chunkSize) {
        await _db.insert(table).values(items.slice(i, i + chunkSize));
    }
}



async function seed() {
    console.log("Seeding...");
    console.time("DB has been seeded!");

    const platform = await getPlatformProxy<AppBindings["Bindings"]>();
    const db = drizzle(platform.env.DB, { schema });

    console.log("states");
    await batchInsert(
        db,
        schema.states,
        states.map(s => ({
            ...s,
            createdAt: new Date(s.createdAt * 1000),
            updatedAt: new Date(s.updatedAt * 1000),
        })),
        10,
    );

}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        console.log("Seeding done!");
        process.exit(0);
    });
