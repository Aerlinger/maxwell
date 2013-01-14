for file in $(find ../test/ -name *.coffee)
do
  sed -E -i'.bk' '/<DEFINE>/,/<\/DEFINE>/d' $file
done
