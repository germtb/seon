if exists("b:current_syntax")
	finish
endif

let b:current_syntax = "seon"

syntax keyword seonBooleans true false
hi def link seonBooleans Boolean

syntax keyword seonKeyword let in match and or
hi def link seonKeyword Keyword

syntax match seonDelimiter "\v\|"
syntax match seonDelimiter "\v-\>"
syntax match seonDelimiter "\v\:"
syntax match seonDelimiter "\v\,"
hi def link seonDelimiter Delimiter

syntax match seonStructure "\v\{"
syntax match seonStructure "\v\}"
syntax match seonStructure "\v\["
syntax match seonStructure "\v\]"
syntax match seonStructure "\v\("
syntax match seonStructure "\v\)"
hi def link seonStructure Structure

syntax match seonOperator /\*/
syntax match seonOperator "\v\&"
syntax match seonOperator "\v\|\|"
syntax match seonOperator "\v/"
syntax match seonOperator /+/
syntax match seonOperator "\v-"
syntax match seonOperator "\v\="
syntax match seonOperator "\v\!\="
syntax match seonOperator "\v\|\>"
syntax match seonOperator "\v\=\>"
syntax match seonOperator "\v\>\="
syntax match seonOperator "\v\>"
syntax match seonOperator "\v\<\="
syntax match seonOperator "\v\<"
hi def link seonOperator Operator

syntax region seonString start=/\v'/ skip=/\v\\./ end=/\v'/
highlight link seonString String

syntax match seonIdentifier /[a-z]\+/
highlight link seonIdentifier Identifier

syntax match seonNumber /\d\+/
syntax match seonNumber /\d\+\.\d\+/
highlight link seonNumber Number

syntax match seonComment /\/\/.*$/
hi def link seonComment Comment
