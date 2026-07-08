export default import.meta.glob(
	[
		"../../services/**/*.service.{ts,js}",
		"../../services/**/+loader.{ts,js}",
		"../../services/**/++helper.{ts,js}",

		"../../builders/**/*.builder.{ts,js}",
		"../../builders/**/+loader.{ts,js}",
		"../../builders/**/++helper.{ts,js}",

		"../../events/**/*.listener.{ts,js}",
		"../../events/**/+loader.{ts,js}",
		"../../events/**/++helper.{ts,js}",

		"../../notifications/**/*.notif.{ts,js}",
		"../../notifications/**/+loader.{ts,js}",
		"../../notifications/**/++helper.{ts,js}",

		"../../jobs/**/*.job.{ts,js}",
		"../../jobs/**/+loader.{ts,js}",
		"../../jobs/**/++helper.{ts,js}",
	],
	{ eager: true },
);
