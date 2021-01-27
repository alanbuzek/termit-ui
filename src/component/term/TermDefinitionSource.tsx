import * as React from "react";
import {getLocalizedOrDefault} from "../../model/MultilingualString";
import Utils from "../../util/Utils";
// @ts-ignore
import {Col, Label, List} from "reactstrap";
import OutgoingLink from "../misc/OutgoingLink";
import AssetLabel from "../misc/AssetLabel";
import TermDefinitionSourceLink from "./TermDefinitionSourceLink";
import {injectIntl} from "react-intl";
import withI18n from "../hoc/withI18n";
import {TermDefinitionBlockProps} from "./TermDefinitionBlock";

const TermDefinitionSource: React.FC<TermDefinitionBlockProps> = props => {
    const {language, i18n, term, withDefinitionSource} = props;
    const definitionText = getLocalizedOrDefault(term.definition, "", language);
    const sources = Utils.sanitizeArray(term.sources);
    if (definitionText.length === 0) {
        return <>
            <Col xl={2} md={4}>
                <Label className="attribute-label definition">{i18n("term.metadata.source")}</Label>
            </Col>
            <Col xl={10} md={8}>
                <List type="unstyled" className="mb-0">
                    {sources.map(s => <>{Utils.isLink(s) ?
                        <OutgoingLink iri={s} label={<AssetLabel iri={s}/>}/> : <>{s}</>}
                        {withDefinitionSource && term.definitionSource &&
                        <TermDefinitionSourceLink term={term}/>}</>)}
                </List>
            </Col>
        </>
    } else {
        return <Col xs={12}>
            {sources.length > 0 && <footer className="blockquote-footer mb-1 term-metadata-definition-source">
                {sources.map(s => {
                    return <>
                        <cite key={s} title={i18n("term.metadata.definitionSource.title")}>
                            {Utils.isLink(s) ? <OutgoingLink iri={s} label={<AssetLabel iri={s}/>}/> : <>{s}</>}
                        </cite>
                        {props.withDefinitionSource && term.definitionSource &&
                        <TermDefinitionSourceLink term={term}/>}
                    </>;
                })}
            </footer>}
        </Col>;
    }
}

export default injectIntl(withI18n(TermDefinitionSource));