#### Overview

Artifacts can be used to provide libraries, rules, schemas, and custom code to applications.  JAR artifacts follow Apache Maven standards which require groupId, artifactId and version to be specified.  JAR files can be uploaded manually and synchronized automatically from a Maven artifacts directory accessible by the Gateway.  Users can also build new JAR files by creating new schemas using the **New Schema** dialog in the DT RTS Console.  Once the JAR artifacts are added to the DT RTS system, Apex applications can reference them in the [Application Configuration](/application_configurations/) page.

#### Viewing Artifacts

Artifacts can be view and managed on the **JAR Artifacts** page in the DT RTS Console.  There you can create new schemas and upload JAR files.

To view the **JAR Artifacts** page, follow the steps below:

1. Click the **Develop** link on the top navigation menu.  The Development page is displayed.
2. Click the **JAR Artifacts** link on the Development page. The JAR Artifacts page is displayed.

Sample JAR artifacts list:

![](/images/jar_artifacts/artifacts-list.png)

#### Searching and Filtering

The search field in the upper right side of the page performs generic search across all fields shown in the table.  However, each column has its own filtering option where the filter is performed on that field only.  As you enter the search string and column filters, the values are added to the URL parameters.  You can bookmark or send this URL to another user.

#### Table Size and Pagination

By default, the table displays twenty artifacts per page.  However, you can change this by clicking on the artifacts count and select a different size.  To the right of the artifact counts are the **previous** and **next** page buttons.  You can click on these buttons to navigate from page to page.  As the artifact offset value changes, the value is added to the URL parameters.  The parameter name for this value is `offset`.  If there are many artifacts in the system, you can simply type an offset number for the `offset` parameter to jump directly to that page.

Artifacts per page dropdown menu:

![](/images/jar_artifacts/items-per-page-menu.png)

To change the artifacts per page, follow the steps below:

1. On the **JAR Artifacts** page, click the artifacts count above the artifacts table.  The dropdown menu is shown.
2. Click the desired _items per page_ menu item.  The table should refresh with the selected artifacts per page.  The selected artifacts per page should also be added to the URL parameters.  This parameter name for this value is `limit`.

#### Creating New Schema

Schemas can be pre-built as JAR files and upload into DT RTS or created manually using the **New Schema** dialog in the DT RTS Console.  When creating a new schema, the Gateway builds the schema as a JAR file.  This schema is then stored in the artifacts global space in DT RTS.  The file name and directory structure follows the Maven directory layout and file name standards.  This dialog can also be launched on the [Application Configuration](/application_configurations/) page. 

To create a new schema, follow the steps below:

1. On the **JAR Artifacts** page, click the **add** button.  A dropdown menu is shown.
2. Click on the **new schema** menu item.  The **New Schema** dialog is shown.

Sample of a new schema dialog:

![](/images/jar_artifacts/new-schema-dialog.png)

The following entries are shown on the **New Schema** dialog:

| Item | Description |
| ---- | ----------- |
| Group ID | This is typically the organization name preceded by _org_ or _com_.  This value is also used as the top level directory where the JAR file is stored.<br/>For example: `org.apache.maven`, `com.datatorrent`, etc. |
| Artifact ID | A name representing this schema.  The schema is built and packaged as a JAR file and this value is used as part of the file name.<br/>For example: `netlet`, `java-xmlbuilder`, etc. |
| Version | The schema version.  The schema is built and packaged as a JAR file and this value is used as part of the file name.<br/>For example: `1.0.0`, `1.0.1`, etc.  |
| Schema Content | A JSON object structure representing the schema definition.  This JSON structure must comply with the [Apache Avro](http://avro.apache.org/docs/current/spec.html#schemas) specification.  You can click on the AVRO link on the dialog to open the Apache Avro schema documentation page in a new browser tab for reference.<br/>Example of an Avro JSON:<pre><code>{<br/>  "type": "enum",<br/>  "name": "states",<br/>  "symbols": ["CA", "MA", "NV", "NY", "TX"]<br/>}</code></pre> |

**Note**: If you enter the Group ID, Artifact ID and Version that match an existing schema or JAR artifact, you will see an error message stating that an artifact with the entered Group ID, Artifact ID and Version already exists.  The **Save** button will be disabled until you change one of the fields.

#### Uploading JAR File

JAR files can be uploaded into the artifacts global space using the DT RTS Console.  When uploading JAR files, the Gateway searches for a pom.xml file in the JAR file to determine the group ID, artifact ID and version for the JAR file.  If the JAR file does not have a pom.xml file, then users can enter the group ID, artifact ID and version in the upload dialog and save the JAR file.  If users have to enter the group ID, artifact ID and version, then the Gateway will create an pom.xml file containing this information and store it in the uploaded JAR file.

To upload a JAR file, follow the steps below:

1. On the **JAR Artifacts** page, click the **add** button.  A dropdown menu is shown.
2. Click on the **upload JAR** menu item.  The **File Artifact Upload** dialog is shown.
3. Drag a valid JAR file into the dialog.  The file is uploaded into a temporary storage for the Gateway to process the it.
4. If a valid JAR file is uploaded, then a JAR file upload form is shown.

    Sample JAR file upload dialog:

    ![](/images/jar_artifacts/jar-upload-dialog.png)

5. Enter the Group ID, Artifact ID and Version if necessary.
6. Click the **Save** button to save the JAR file to the artifacts global space.

Below are the descriptions of the fields shown on the dialog:

| Item | Description |
| ---- | ----------- |
| Group ID |  This value is found in the `pom.xml` file inside the JAR file by the Gateway. If the pom.xml file is missing, then the value is empty.  You must enter an appropriate group ID in order to save the JAR file. This is typically the JAR artifact organization name preceded by _org_ or _com_.  This value is also used as the top level directory where the JAR file.<br/>For example: `org.apache.maven`, `com.datatorrent`, etc. |
| Artifact ID | This value is found in the `pom.xml` file inside the JAR file by the Gateway.  If the pom.xml file is missing, then the value is empty.  You must enter an appropriate artifact ID in order to save the JAR file.  This value is also used as part of the file name when saving the JAR file to the artifacts global space.<br/>For example: `netlet`, `java-xmlbuilder`, etc. |
| Version | This value is found in the `pom.xml` file inside the JAR file by the Gateway.  If the pom.xml file is missing, then the value is empty.  You must enter an appropriate version in order to save the JAR file.  This value is also used as part of the file name when saving the JAR file to the artifacts global space.<br/>For example: `1.0.0`, `1.0.1`, etc. |
| Tags | The Gateway analyzes the JAR file to determine the tags for the JAR file.  Possible tag values are: `rule` and `schema`.  If the Gateway cannot determine the tags for this JAR file, then an empty field is shown.  When saving the JAR file, the value `other` is saved with the JAR file. _This field is readonly_. |
| Size | The size of the JAR file. _This field is readonly_. |
| Path | The path and file name where the JAR file is temporary stored for processing. _This field is readonly_. |

After uploading a JAR file, the Gateway processes it and shows the information gathers from the JAR file.  You can process a different JAR file by dragging another JAR file into the top section of the dialog.  Alternatively, you can click on the down chevron button to expand that section and click on the **Choose another file** button.

If you are loading a JAR file that already exists in the artifacts global space, you can overwrite the existing JAR file by clicking on the **Replace** button on the dialog.

#### Synchronizing JAR Files

In addition to uploading JAR files and creating new schemas manually, you can write JAR files directly to the local file system designated as artifacts directories and the Gateway would process these JAR files and write them to HDFS.  You must configure the `dt.gateway.maven.local.repo` property in the `dt-site.xml` file in order for this synchronization process to work.

To configure the Gateway to synchronize JAR files on the local file system with HDFS, follow the steps below:

1. Add the XML below to the **dt-site.xml** file.
    <pre><code class="hljs gherkin">&lt;property&gt;<br/>  &lt;name&gt;dt.gateway.maven.local.repo&lt;/name&gt;</br>  &lt;value&gt;_path-where-artifacts-are-stored-on-the-local-file-system_&lt;/value&gt;</br>&lt;/property&gt;</code></pre>
2. Restart the Gateway if necessary.

Sample XML to synchronize JAR files:

<pre><code class="hljs gherkin">&lt;property&gt;<br/>  &lt;name&gt;dt.gateway.maven.local.repo&lt;/name&gt;</br>  &lt;value&gt;/Users/willet/.dt/artifacts&lt;/value&gt;</br>&lt;/property&gt;
</code></pre>

The example above designates the directory named `/Users/willet/.dt/artifacts` on the local file system as the home directory where all JAR artifacts are stored.  This value varies from installation to installation.