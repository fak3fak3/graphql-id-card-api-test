/**
 * The operation Apollo Sandbox opens with. Without it Sandbox shows a
 * placeholder (`query ExampleQuery { id }`) that is invalid for this schema.
 * An e2e test executes this document, so it cannot drift from the schema.
 */
export const SANDBOX_DOCUMENT = `query Profile {
  profile {
    name
    headline
    description
    links {
      kind
      label
      url
    }
    skills {
      name
      category
    }
    experience {
      company
      position
      period
      achievements {
        text
      }
    }
    projects {
      name
      description
      url
      repositoryUrl
      skills {
        name
      }
    }
  }
}
`;
