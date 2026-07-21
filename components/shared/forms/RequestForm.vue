<script setup lang="ts">
const props = defineProps({
	selectedServices: {
		type: Array,
		default: [],
	},
});
</script>

<template>
	<template v-if="selectedServices.length > 0">
		<Button class="rounded-none! font-mono -mt-1px"
			>[{{ selectedServices.length }}] service{{
				selectedServices.length !== 1 ? "s" : ""
			}}
			selected</Button
		>
	</template>

	<form>
		<FieldSet class="gap-3">
			<FieldGroup>
				<Field data-not>
					<Input
						id="subject"
						type="text"
						placeholder="Request Subject"
						required
					/>
				</Field>

				<Field data-not>
					<Textarea placeholder="Message Box" id="message" required />
				</Field>

				<Field orientation="vertical" class="email-address">
					<details>
						<summary class="block">
							<FieldContent>
								<FieldTitle>
									Email Address
									<span
										class="i-solar:alt-arrow-down-outline text-2xl"
									></span>
								</FieldTitle>
								<FieldDescription>
									*Required to send in a request
								</FieldDescription>
							</FieldContent>
						</summary>
						<Input
							id="email"
							type="text"
							placeholder="Email Address"
							class="mt-3"
							required
						/>
					</details>
				</Field>

				<Field orientation="horizontal" class="items-center!">
					<label class="flex-1" for="attachments">
						<FieldContent>
							<FieldTitle>Include Attachments</FieldTitle>
							<FieldDescription
								>Upload attachments up to 20mb</FieldDescription
							>
						</FieldContent>
					</label>

					<Input type="file" id="attachments" hidden />
					<span
						class="i-hugeicons:document-attachment text-4xl"
					></span>
				</Field>
			</FieldGroup>

			<FieldGroup>
				<Field
					orientation="horizontal"
					data-not
					class="items-center! btns"
				>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button
									variant="outline"
									size="icon-lg"
									class="flex"
								>
									<span
										class="i-hugeicons:mail-at-sign-01 text-3xl"
									></span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Copy email address to clipboard</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<Button
						type="submit"
						class="flex-1 justify-between"
						size="lg"
					>
						Send Request
						<span
							class="i-solar:arrow-right-up-outline text-2xl"
						></span>
					</Button>
				</Field>
			</FieldGroup>
		</FieldSet>
	</form>
</template>

<style lang="scss" scoped>
form {
	@apply: bg-white m-2 lg:m-9 shadow p-3;
}

[data-slot="field-group"] {
	@apply: gap-2.5;
}

[data-slot="field"]:not([data-not]) {
	@apply: border border-neutral-200;
	@apply: p-3;

	[data-slot="field-label"] {
		@apply: text-lg font-urbanist font-semibold text-neutral-700;
		@apply: w-full flex items-center justify-between;
	}

	[data-slot="field-description"] {
		@apply: lg:text-base font-urbanist font-semibold text-neutral-400 -mt-1;
	}
}

.email-address {
	input {
		@apply: bg-neutral-50;
	}
}

input {
	@apply: text-lg font-urbanist font-semibold text-neutral-600;
	@apply: rounded-none px-4 py-6;
}

textarea {
	@apply: rounded-none p-3;
	@apply: text-lg font-urbanist font-semibold text-neutral-800;
	@apply: min-h-50 bg-neutral-100;
}

.btns {
	button[data-slot="button"] {
		@apply: rounded-none p-3 text-xl size-auto;
	}
}
</style>
