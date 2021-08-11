export default function FormFieldCollectionErrorHeader({ overallErrors }: { overallErrors: { [key: string]: string } }) {
	return Object.keys(overallErrors).length === 0 ? null :
		<>
			<h1>Something went wrong:</h1>
			< h2 >
				{
					Object.values(overallErrors).map((e, index) => {
						return <p key={index}>
							{e}
						</p>
					})
				}
			</h2>
		</>

}