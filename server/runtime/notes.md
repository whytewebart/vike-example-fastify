


`./entry.ts`
```ts
	// Autoload plugins, routes, and schema loaders
	void i.register(autoLoad, { dir: join(_directory, "plugins") });
	void i.register(autoLoad, { dir: join(_directory, "routes") });
	void i.register(autoLoad, {
		dir: join(_directory, "schemas"),
		indexPattern: /^\+loader\.(ts|js)$/i,
	});
```
